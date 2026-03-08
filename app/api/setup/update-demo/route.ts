import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Bu endpoint sadece demo kurulumu için kullanılır.
// Tek seferlik çalıştırılıp ardından silinebilir.
export async function GET() {
    try {
        await dbConnect();

        const hashed = await bcrypt.hash('demo1234', 12);

        const result = await User.updateOne(
            { email: { $in: ['demo@fotoplan.com', 'demo@weey.net'] } },
            { $set: { email: 'demo@weey.net', password: hashed } }
        );

        if (result.modifiedCount > 0) {
            return NextResponse.json({
                success: true,
                message: 'Demo hesap güncellendi.',
                email: 'demo@weey.net',
                password: 'demo1234'
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Güncellenecek demo hesap bulunamadı. Seed çalıştırın.'
            });
        }
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
