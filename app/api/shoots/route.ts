import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Shoot from '@/models/Shoot';
import User from '@/models/User';

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
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const customerId = searchParams.get('customerId');

    try {
        let query: any = {};

        // If client, restrict to their own shoots
        if (session.user.role === 'couple') {
            if (!session.user.customerId) {
                return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
            }
            query.customerId = session.user.customerId;
        }

        // If admin, filter by photographerId
        if (session.user.role === 'admin') {
            const photographerId = await getPhotographerId(session);
            console.log('GET Shoots - Session email:', session.user.email);
            console.log('GET Shoots - Photographer ID:', photographerId);

            if (photographerId) {
                query.photographerId = photographerId;
            }

            // Admin can filter by customerId via query param
            if (customerId) {
                query.customerId = customerId;
            }
        }

        // Date filtering for calendar
        if (start && end) {
            query.date = { $gte: new Date(start), $lte: new Date(end) };
        }

        console.log('GET Shoots - Query:', JSON.stringify(query));

        const shootsRaw = await Shoot.find(query).populate('customerId', 'brideName groomName phone').sort({ date: 1 });

        console.log('GET Shoots - Found count:', shootsRaw.length);

        // Map to ensure proper customer structure in response
        const shoots = shootsRaw.map((shoot: any) => {
            const shootObj = shoot.toObject();
            return {
                ...shootObj,
                customer: {
                    brideName: shoot.customerId?.brideName || '',
                    groomName: shoot.customerId?.groomName || '',
                    phone: shoot.customerId?.phone || ''
                }
            };
        });

        return NextResponse.json(shoots);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shoots' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        console.log('POST Shoot - Request body:', body);

        // Get photographer ID
        const photographerId = await getPhotographerId(session);
        console.log('POST Shoot - Session email:', session.user.email);
        console.log('POST Shoot - Photographer ID:', photographerId);

        if (!photographerId) {
            console.error('POST Shoot - ERROR: No photographer ID found!');
            return NextResponse.json({ error: 'Fotoğrafçı bilgisi bulunamadı' }, { status: 400 });
        }

        const { customerId, date, type, location, notes, city, packageId, contractId, agreedPrice, deposit } = body;

        // If packageId is provided, get package name from the PACKAGES list
        let packageName = '';
        if (packageId) {
            const PACKAGES = [
                { id: '1', name: 'Gold Düğün Paketi', price: 15000 },
                { id: '2', name: 'Platin Dış Çekim', price: 8500 },
                { id: '3', name: 'Standart Video Klip', price: 5000 },
            ];
            const pkg = PACKAGES.find((p: any) => p.id === packageId);
            if (pkg) packageName = pkg.name;
        }

        const newShoot = await Shoot.create({
            customerId,
            photographerId, // Associate with photographer
            date,
            type,
            location,
            city,
            packageName,
            contractId,
            agreedPrice: agreedPrice || 0,
            deposit: deposit || 0,
            notes,
            status: 'planned'
        });

        console.log('POST Shoot - Created with photographerId:', newShoot.photographerId);
        return NextResponse.json(newShoot, { status: 201 });
    } catch (error: any) {
        console.error('Shoot creation error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create shoot',
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        }, { status: 500 });
    }
}
