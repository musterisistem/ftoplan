import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CouponManagerClient from './CouponManagerClient';

export const metadata = {
    title: 'Kupon Yönetimi - Foto Plan',
};

export default async function CouponsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'superadmin') {
        redirect('/login');
    }

    return <CouponManagerClient />;
}
