import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    try {
        const { newPassword } = await req.json();

        if (!newPassword || newPassword.length < 4) {
            return NextResponse.json({ error: 'Geçerli bir şifre giriniz' }, { status: 400 });
        }

        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Update customer plainPassword
        customer.plainPassword = newPassword;
        await customer.save();

        // Update user hashed password
        if (customer.userId) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(customer.userId, { password: hashedPassword });
        }

        // Return updated customer with user info
        const user = customer.userId ? await User.findById(customer.userId).select('email') : null;

        return NextResponse.json({
            ...customer.toObject(),
            user: user ? {
                email: user.email,
                plainPassword: customer.plainPassword,
            } : null
        });
    } catch (error: any) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Şifre sıfırlama başarısız' }, { status: 500 });
    }
}
