import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;

        if (!Object.values(EmailTemplateType).includes(type as any)) {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        await dbConnect();

        const user = await (await import('@/models/User')).default.findOne({ email: session.user.email });
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete custom template
        await EmailTemplate.findOneAndDelete({
            photographerId: user._id,
            templateType: type
        });

        return NextResponse.json({ message: 'Template reset to default successfully' });

    } catch (error: any) {
        console.error('Reset customization error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
