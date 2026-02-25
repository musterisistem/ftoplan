import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contract from '@/models/Contract';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    try {
        const { id } = params;

        // Soft delete: set isActive to false
        const contract = await Contract.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!contract) {
            return NextResponse.json({ error: 'Sözleşme bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Sözleşme başarıyla silindi' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
