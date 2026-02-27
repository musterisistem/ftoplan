import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import { DEFAULT_CUSTOMIZATIONS, buildEmailFromCustomization } from '@/lib/emailTemplateCustomization';

export async function GET(
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

        // Find global custom template
        const customTemplate = await EmailTemplate.findOne({
            photographerId: null,
            templateType: type
        });

        const customization = customTemplate
            ? JSON.parse(customTemplate.htmlContent)
            : DEFAULT_CUSTOMIZATIONS[type as keyof typeof DEFAULT_CUSTOMIZATIONS];

        return NextResponse.json({
            type,
            customization,
            isCustom: !!customTemplate
        });

    } catch (error: any) {
        console.error('[System EmailTemplates] Detail Get error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;
        const { customization } = await req.json();

        await dbConnect();

        // Build HTML from customization to get the subject
        const { subject } = buildEmailFromCustomization(
            type as any,
            customization,
            {}
        );

        // Save as global template (photographerId: null)
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
        console.error('[System EmailTemplates] Update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
