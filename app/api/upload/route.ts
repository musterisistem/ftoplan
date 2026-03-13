import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToBunny } from '@/lib/bunny';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const subfolder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
        }

        // Create a unique filename
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${timestamp}-${cleanName}`;

        // Centralized folder structure:
        // - If subfolder starts with 'app/', place at `{subfolder}/images`
        // - If subfolder starts with 'album-covers/', place at the root `album-covers/...` path (NOT under images/)
        // - Otherwise default to `images/{subfolder}`
        let folder = `images/${subfolder}`;
        if (subfolder.startsWith('app/')) {
            // e.g. "app/gullugil" -> "app/gullugil/images"
            folder = `${subfolder}/images`;
        } else if (subfolder.startsWith('album-covers/')) {
            // e.g. "album-covers/mir-album/weey-net-fotografcilik" -> kept as-is at root
            folder = subfolder;
        }

        const url = await uploadToBunny(file, filename, folder);

        if (!url) {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload processing failed' }, { status: 500 });
    }
}
