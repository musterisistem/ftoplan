import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import { DEFAULT_CUSTOMIZATIONS } from '@/lib/emailTemplateCustomization';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Superadmin manages these system templates
        const allowedTypes = [
            'VERIFY_EMAIL',
            'WELCOME_PHOTOGRAPHER',
            'PLAN_UPDATED'
        ];

        // Get custom templates (global defaults have photographerId: null)
        const customTemplates = await EmailTemplate.find({
            photographerId: null,
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
        console.error('[System EmailTemplates] Get error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
