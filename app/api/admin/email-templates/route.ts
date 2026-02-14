import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import User from '@/models/User';
import { DEFAULT_TEMPLATES } from '@/lib/emailTemplates';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        // Get photographer ID
        const user = await User.findOne({ email: session.user.email, role: 'admin' });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch all custom templates for this photographer
        const customTemplates = await EmailTemplate.find({ photographerId: user._id });

        // Build response with custom or default templates
        const templates = Object.values(EmailTemplateType).map(type => {
            const custom = customTemplates.find(t => t.templateType === type);
            const defaultTemplate = DEFAULT_TEMPLATES[type];

            return {
                type,
                subject: custom?.subject || defaultTemplate.subject,
                htmlContent: custom?.htmlContent || defaultTemplate.htmlContent,
                variables: defaultTemplate.variables,
                isCustom: !!custom,
                isActive: custom?.isActive ?? true,
                _id: custom?._id,
            };
        });

        return NextResponse.json(templates);
    } catch (error: any) {
        console.error('Error fetching email templates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
