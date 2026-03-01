import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import Package from '@/models/Package';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const body = await req.json();
        const { packageId } = body;

        if (!packageId) {
            return NextResponse.json({ success: false, error: 'Paket seçilmedi.' }, { status: 400 });
        }

        await dbConnect();

        // Find the selected package by its 'id' field (not MongoDB _id)
        const dbPackage = await Package.findOne({ id: packageId });
        if (!dbPackage) {
            return NextResponse.json({ success: false, error: 'Geçersiz paket seçimi.' }, { status: 400 });
        }

        // Check if user is already on this package
        if (session.user.packageType === packageId && session.user.packageType !== 'trial') {
            return NextResponse.json({ success: false, error: 'Zaten bu pakete sahipsiniz.' }, { status: 400 });
        }

        // Generate unique Order Number
        const orderNo = `UP${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create Pending Order
        const order = await Order.create({
            orderNo,
            userId: session.user.id,
            packageId: dbPackage._id,
            amount: dbPackage.price,
            currency: 'TRY',
            status: 'pending',
            // No draftUserData needed since user already exists
        });

        return NextResponse.json({
            success: true,
            orderNo: order.orderNo,
            amount: order.amount,
            message: 'Sipariş oluşturuldu, ödeme adımına geçiliyor.'
        }, { status: 201 });

    } catch (error: any) {
        console.error('[Upgrade Create] Error:', error);
        return NextResponse.json({ success: false, error: 'Sipariş oluşturulurken bir hata oluştu.' }, { status: 500 });
    }
}
