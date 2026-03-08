import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'ID gereklidir' }, { status: 400 });

        await dbConnect();
        const body = await req.json();

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            {
                $set: {
                    isActive: body.isActive !== undefined ? body.isActive : true,
                    maxUses: body.maxUses !== undefined ? Number(body.maxUses) : undefined,
                    validUntil: body.validUntil !== undefined ? body.validUntil : undefined
                }
            },
            { new: true }
        );

        if (!updatedCoupon) {
            return NextResponse.json({ error: 'Kupon bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, coupon: updatedCoupon });
    } catch (error) {
        console.error('Kupon güncelleme hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'ID gereklidir' }, { status: 400 });

        await dbConnect();
        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return NextResponse.json({ error: 'Kupon bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Kupon silindi' });
    } catch (error) {
        console.error('Kupon silme hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
