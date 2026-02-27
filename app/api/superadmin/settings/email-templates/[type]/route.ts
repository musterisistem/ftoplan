import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import User from '@/models/User';
import { DEFAULT_CUSTOMIZATIONS, buildEmailFromCustomization } from '@/lib/emailTemplateCustomization';

export async function GET(
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

        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Find custom template
        const customTemplate = await EmailTemplate.findOne({
            $or: [{ photographerId: user._id }, { photographerId: null }],
            templateType: type
        }).sort({ photographerId: -1 }); // Prioritize specific over global if both exist

        const customization = customTemplate
            ? JSON.parse(customTemplate.htmlContent)
            : DEFAULT_CUSTOMIZATIONS[type as keyof typeof DEFAULT_CUSTOMIZATIONS];

        return NextResponse.json({
            type,
            customization,
            isCustom: !!customTemplate
        });

    } catch (error: any) {
        console.error('[SuperAdmin EmailTemplates] Detail Get error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;
        const { customization } = await req.json();

        if (!Object.values(EmailTemplateType).includes(type as any)) {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Build HTML from customization
        const { subject } = buildEmailFromCustomization(
            type as any,
            customization,
            {}
        );

        // Save as global template (photographerId: null) or superadmin specific
        const template = await EmailTemplate.findOneAndUpdate(
            { photographerId: null, templateType: type },
            {
                photographerId: null,
                templateType: type,
                subject,
                htmlContent: JSON.stringify(customization),
                isActive: true,
                variables: []
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            type,
            customization: JSON.parse(template.htmlContent),
            isCustom: true
        });

    } catch (error: any) {
        console.error('[SuperAdmin EmailTemplates] Update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
