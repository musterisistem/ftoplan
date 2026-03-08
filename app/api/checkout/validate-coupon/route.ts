import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Kupon kodu gereklidir' }, { status: 400 });
        }

        // Find the coupon (case-insensitive)
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return NextResponse.json({ error: 'Geçersiz kupon kodu' }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: 'Bu kupon kodu artık aktif değil' }, { status: 400 });
        }

        // Check if expired
        if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
            return NextResponse.json({ error: 'Bu kuponun süresi dolmuş' }, { status: 400 });
        }

        // Check max uses limits
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ error: 'Bu kupon kodu kullanım limitine ulaşmış' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            discountPercentage: coupon.discountPercentage,
            code: coupon.code
        });

    } catch (error) {
        console.error('Kupon doğrulama hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
