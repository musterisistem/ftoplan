import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete customer session cookie
        cookieStore.delete({
            name: 'customer-session',
            path: '/'
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Customer logout error:', error);
        return NextResponse.json(
            { error: 'Çıkış işlemi başarısız' },
            { status: 500 }
        );
    }
}
