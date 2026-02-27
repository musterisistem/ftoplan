import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import User from '@/models/User';
import { DEFAULT_CUSTOMIZATIONS } from '@/lib/emailTemplateCustomization';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Superadmin manages these system templates
        const allowedTypes = [
            EmailTemplateType.VERIFY_EMAIL,
            EmailTemplateType.WELCOME_PHOTOGRAPHER,
            EmailTemplateType.PLAN_UPDATED
        ];

        // Get custom templates for the superadmin or global defaults
        const customTemplates = await EmailTemplate.find({
            $or: [
                { photographerId: user._id },
                { photographerId: null }
            ],
            templateType: { $in: allowedTypes }
        });

        // Build response
        const templates = allowedTypes.map(type => {
            const custom = customTemplates.find(t => t.templateType === type);

            return {
                type,
                customization: custom ? JSON.parse(custom.htmlContent) : DEFAULT_CUSTOMIZATIONS[type as keyof typeof DEFAULT_CUSTOMIZATIONS],
                isCustom: !!custom
            };
        });

        return NextResponse.json(templates);

    } catch (error: any) {
        console.error('[SuperAdmin EmailTemplates] Get error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
