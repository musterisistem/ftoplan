import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Helper to get photographer ID from session
async function getPhotographerId(session: any) {
    if (!session?.user?.email) return null;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email, role: 'admin' });
    return user?._id || null;
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    try {
        // Get photographer ID from session — REQUIRED for data isolation
        const photographerId = await getPhotographerId(session);

        if (session.user.role === 'admin' && !photographerId) {
            // Cannot determine photographer — return empty rather than all records
            return NextResponse.json([]);
        }

        // Build query — always scoped to this photographer
        let query: any = {};

        if (session.user.role === 'admin') {
            query.photographerId = photographerId;
        }

        if (search) {
            query.$or = [
                { brideName: { $regex: search, $options: 'i' } },
                { groomName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search.replace(/\s/g, ''), $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });
        return NextResponse.json(customers);
    } catch (error) {
        console.error('GET customers error:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        console.log('Customer creation request body:', body);

        const { brideName, groomName, phone, email, weddingDate, notes, tcId } = body;

        // Validate required fields
        if (!brideName) {
            return NextResponse.json({ error: 'Gelin adı gereklidir' }, { status: 400 });
        }
        if (!phone) {
            return NextResponse.json({ error: 'Telefon numarası gereklidir' }, { status: 400 });
        }

        // Get photographer ID
        const user = await User.findOne({ email: session.user.email, role: 'admin' });
        const photographerId = user?._id || null;

        if (!photographerId && session.user.role === 'admin') {
            return NextResponse.json({ error: 'Fotoğrafçı bilgisi bulunamadı' }, { status: 400 });
        }

        // Limit Enforcement for Trial Users
        if (user?.packageType === 'trial') {
            const customerCount = await Customer.countDocuments({ photographerId });
            if (customerCount >= 1) {
                return NextResponse.json({
                    error: 'Deneme paketinde sadece 1 aktif müşteri ekleyebilirsiniz. Lütfen paketinizi yükseltin.'
                }, { status: 403 });
            }
        }

        // Create user account
        const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const username = `${slugify(brideName)}${slugify(groomName || '')}`;
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const userEmail = `${username}@weey.net`;

        console.log('Creating user with email:', userEmail);

        const newUser = await User.create({
            email: userEmail,
            password: hashedPassword,
            role: 'couple',
        });

        console.log('User created successfully:', newUser._id);

        const newCustomer = await Customer.create({
            brideName,
            groomName,
            phone,
            email,
            weddingDate,
            userId: newUser._id,
            photographerId: photographerId, // Associate with photographer
            status: 'active',
            notes,
            tcId,
            plainPassword: tempPassword,
            plainUsername: username,
        });

        console.log('Customer created successfully:', newCustomer._id);

        // Update user with customerId
        newUser.customerId = newCustomer._id;
        await newUser.save();

        console.log('User updated with customerId');

        return NextResponse.json({
            ...newCustomer.toObject(),
            credentials: {
                username: userEmail,
                displayUsername: username,
                password: tempPassword
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Customer create error:', error);

        if (error.code === 11000) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
        }

        return NextResponse.json({
            error: error.message || 'Müşteri oluşturulurken hata oluştu',
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        }, { status: 500 });
    }
}
