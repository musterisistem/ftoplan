import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key');

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Kullanıcı adı ve şifre gereklidir' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find customer by plainUsername
        const customer = await Customer.findOne({ plainUsername: username });

        console.log('🔍 Login attempt for username:', username);
        console.log('📦 Customer found:', customer ? 'Yes' : 'No');

        if (customer) {
            console.log('👤 Customer ID:', customer._id);
            console.log('🔑 Has plainUsername:', !!customer.plainUsername);
            console.log('🔑 Has plainPassword:', !!customer.plainPassword);
            console.log('🔑 plainUsername value:', customer.plainUsername);
            console.log('🔑 Password match:', customer.plainPassword === password);
        }

        if (!customer) {
            console.log('❌ Customer not found for username:', username);
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 401 }
            );
        }

        // Verify plainPassword (stored as plain text for customers)
        if (customer.plainPassword !== password) {
            console.log('❌ Password mismatch. Expected:', customer.plainPassword, 'Got:', password);
            return NextResponse.json(
                { error: 'Hatalı şifre' },
                { status: 401 }
            );
        }

        console.log('✅ Login successful for customer:', customer._id);

        // Capture the client IP using standard headers
        const forwardedFor = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const rawIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP');

        // Remove IPv6 wrapper if present
        const clientIp = rawIp.replace(/^.*:/, '');

        // Update successful login details on the customer object
        await Customer.findByIdAndUpdate(customer._id, {
            $set: {
                lastLoginAt: new Date(),
                lastLoginIp: clientIp
            }
        });

        console.log(`✅ Login successful for customer: ${customer._id} from IP: ${clientIp}`);

        // Populate photographerId for response
        await customer.populate('photographerId');

        // Create JWT token with customer data
        const token = await new SignJWT({
            customerId: customer._id.toString(),
            photographerId: customer.photographerId?._id?.toString() || customer.photographerId?.toString(),
            name: customer.brideName + (customer.groomName ? ' & ' + customer.groomName : ''),
            role: 'customer',
            username: customer.plainUsername,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .setIssuedAt()
            .sign(JWT_SECRET);

        // Set custom cookie for customer session
        const cookieStore = await cookies();
        cookieStore.set('customer-session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', // Changed from /studio to make it accessible to API routes
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({
            success: true,
            customer: {
                id: customer._id.toString(),
                name: customer.brideName + (customer.groomName ? ' & ' + customer.groomName : ''),
                photographerId: customer.photographerId?._id?.toString() || customer.photographerId?.toString(),
                username: customer.plainUsername,
            }
        });

    } catch (error) {
        console.error('Customer login error:', error);
        return NextResponse.json(
            { error: 'Giriş işlemi başarısız' },
            { status: 500 }
        );
    }
}
