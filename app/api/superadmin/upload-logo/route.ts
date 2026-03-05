import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Sadece görsel dosyaları kabul edilir' }, { status: 400 });
        }

        // Create unique filename
        const timestamp = Date.now();
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `ref-${timestamp}.${ext}`;

        // Save to public/uploads/references/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'references');
        await mkdir(uploadDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const url = `/uploads/references/${filename}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Logo upload error:', error);
        return NextResponse.json({ error: error.message || 'Yükleme başarısız' }, { status: 500 });
    }
}
