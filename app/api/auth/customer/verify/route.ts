import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key');

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('customer-session')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Oturum bulunamadı' },
                { status: 401 }
            );
        }

        // Verify JWT
        const { payload } = await jwtVerify(token, JWT_SECRET);

        return NextResponse.json({
            customer: {
                id: payload.customerId,
                name: payload.name,
                photographerId: payload.photographerId,
                username: payload.username,
                role: payload.role,
            }
        });

    } catch (error) {
        console.error('Customer verify error:', error);
        return NextResponse.json(
            { error: 'Geçersiz oturum' },
            { status: 401 }
        );
    }
}
