import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailTemplate, { EmailTemplateType } from '@/models/EmailTemplate';
import { DEFAULT_CUSTOMIZATIONS } from '@/lib/emailTemplateCustomization';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        // Get custom templates for this user (or system-wide if superadmin)
        const query = user.role === 'superadmin'
            ? { photographerId: user._id } // Superadmins manage system-wide templates stored under their own ID
            : { photographerId: user._id };

        const customTemplates = await EmailTemplate.find(query);

        // Build response with only allowed template types
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
        console.error('Get customizations error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
