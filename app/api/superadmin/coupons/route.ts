import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Son eklenenler en üstte
        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return NextResponse.json({ success: true, coupons });
    } catch (error) {
        console.error('Kupon getirme hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validation check
        if (!body.code || !body.discountPercentage) {
            return NextResponse.json({ error: 'Kod ve indirim oranı zorunludur' }, { status: 400 });
        }

        // Check if code exists
        const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
        if (existing) {
            return NextResponse.json({ error: 'Bu kupon kodu zaten mevcut' }, { status: 400 });
        }

        const newCoupon = await Coupon.create({
            code: body.code.toUpperCase(),
            discountPercentage: Number(body.discountPercentage),
            maxUses: Number(body.maxUses) || 0,
            validUntil: body.validUntil || null,
            isActive: body.isActive !== undefined ? body.isActive : true
        });

        return NextResponse.json({ success: true, coupon: newCoupon });
    } catch (error) {
        console.error('Kupon oluşturma hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
