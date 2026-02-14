import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import User from '@/models/User';
import { DEFAULT_TEMPLATES } from '@/lib/emailTemplates';

export async function GET(
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

        // Try to find custom template
        const customTemplate = await EmailTemplate.findOne({
            photographerId: user._id,
            templateType: type,
        });

        // Get default template
        const defaultTemplate = DEFAULT_TEMPLATES[type as keyof typeof DEFAULT_TEMPLATES];

        // Return custom or default
        const template = {
            type,
            subject: customTemplate?.subject || defaultTemplate.subject,
            htmlContent: customTemplate?.htmlContent || defaultTemplate.htmlContent,
            variables: defaultTemplate.variables,
            isCustom: !!customTemplate,
            isActive: customTemplate?.isActive ?? true,
            _id: customTemplate?._id,
        };

        return NextResponse.json(template);
    } catch (error: any) {
        console.error('Error fetching email template:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
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

        const body = await req.json();
        const { subject, htmlContent, isActive } = body;

        if (!subject || !htmlContent) {
            return NextResponse.json({ error: 'Subject and htmlContent are required' }, { status: 400 });
        }

        // Get default variables for this template type
        const defaultTemplate = DEFAULT_TEMPLATES[type as keyof typeof DEFAULT_TEMPLATES];

        // Upsert email template
        const template = await EmailTemplate.findOneAndUpdate(
            { photographerId: user._id, templateType: type },
            {
                photographerId: user._id,
                templateType: type,
                subject,
                htmlContent,
                variables: defaultTemplate.variables,
                isActive: isActive ?? true,
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(template);
    } catch (error: any) {
        console.error('Error updating email template:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
