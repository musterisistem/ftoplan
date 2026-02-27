import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate from '@/models/EmailTemplate';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;

        await dbConnect();

        // Standard way to reset for superadmin: remove the global custom template
        await EmailTemplate.deleteOne({
            photographerId: null,
            templateType: type
        });

        return NextResponse.json({ success: true, message: 'Şablon başarıyla sıfırlandı' });

    } catch (error: any) {
        console.error('[System EmailTemplates] Reset error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
