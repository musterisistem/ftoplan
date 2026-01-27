import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key');

export async function getCustomerSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('customer-session')?.value;

        if (!token) {
            return null;
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return {
            customerId: payload.customerId as string,
            name: payload.name as string,
            photographerId: payload.photographerId as string,
            username: payload.username as string,
            role: payload.role as string,
        };
    } catch (error) {
        console.error('Customer session verification failed:', error);
        return null;
    }
}
