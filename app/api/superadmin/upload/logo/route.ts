import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToBunny } from '@/lib/bunny';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 });
        }

        // Generate a safe unique filename
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `logo_${timestamp}_${cleanName}`;

        // Upload to BunnyCDN in 'mail-templates' folder
        const url = await uploadToBunny(file, filename, 'mail-templates');

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('SuperAdmin Logo Upload Error:', error);
        return NextResponse.json({ error: 'Logo yüklenemedi.' }, { status: 500 });
    }
}
