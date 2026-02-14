import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import { DEFAULT_CUSTOMIZATIONS, buildEmailFromCustomization, TemplateCustomization } from '@/lib/emailTemplateCustomization';

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

        const User = (await import('@/models/User')).default;
        const user = await User.findOne({ email: session.user.email });
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Define which templates each role can manage
        const rolePermissions: Record<string, string[]> = {
            superadmin: [EmailTemplateType.VERIFY_EMAIL, EmailTemplateType.WELCOME_PHOTOGRAPHER],
            admin: [EmailTemplateType.CUSTOMER_STATUS_UPDATE, EmailTemplateType.PLAN_UPDATED]
        };

        const allowedTypes = rolePermissions[user.role] || [];
        if (!allowedTypes.includes(type as any)) {
            return NextResponse.json({ error: 'Bu şablonu düzenleme yetkiniz yok' }, { status: 403 });
        }

        // Find custom template
        const customTemplate = await EmailTemplate.findOne({
            photographerId: user._id,
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
        console.error('Get customization error:', error);
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

        const User = (await import('@/models/User')).default;
        const user = await User.findOne({ email: session.user.email });
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Define which templates each role can manage
        const rolePermissions: Record<string, string[]> = {
            superadmin: [EmailTemplateType.VERIFY_EMAIL, EmailTemplateType.WELCOME_PHOTOGRAPHER],
            admin: [EmailTemplateType.CUSTOMER_STATUS_UPDATE, EmailTemplateType.PLAN_UPDATED]
        };

        const allowedTypes = rolePermissions[user.role] || [];
        if (!allowedTypes.includes(type as any)) {
            return NextResponse.json({ error: 'Bu şablonu düzenleme yetkiniz yok' }, { status: 403 });
        }

        // Build HTML from customization
        const { subject, htmlContent } = buildEmailFromCustomization(
            type as keyof typeof DEFAULT_CUSTOMIZATIONS,
            customization,
            {}
        );

        // Save/update template
        const template = await EmailTemplate.findOneAndUpdate(
            { photographerId: user._id, templateType: type },
            {
                photographerId: user._id,
                templateType: type,
                subject,
                htmlContent: JSON.stringify(customization), // Store customization as JSON
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
        console.error('Update customization error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
