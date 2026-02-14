import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import User from '@/models/User';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { type } = await params;

    try {
        // Validate template type
        if (!Object.values(EmailTemplateType).includes(type as any)) {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        // Get photographer ID
        const user = await User.findOne({ email: session.user.email, role: 'admin' });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete custom template (reset to default)
        await EmailTemplate.findOneAndDelete({
            photographerId: user._id,
            templateType: type,
        });

        return NextResponse.json({ message: 'Template reset to default successfully' });
    } catch (error: any) {
        console.error('Error resetting email template:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
