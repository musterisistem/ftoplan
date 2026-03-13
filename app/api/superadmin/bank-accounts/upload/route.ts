import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

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
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
        const filename = `bank-${timestamp}-${safeName}`;

        // Save to public/uploads/banks/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banks');
        await mkdir(uploadDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const url = `/uploads/banks/${filename}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('[Bank Logo Upload Error]', error);
        return NextResponse.json({ error: 'Yükleme başarısız oldu' }, { status: 500 });
    }
}
