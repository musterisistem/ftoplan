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
        console.log(`[EmailTemplates] User check: ${session.user.email}, Role: ${user?.role}`);

        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            console.log(`[EmailTemplates] Access Forbidden for: ${user?.role}`);
            return NextResponse.json({ error: `Forbidden: Role is ${user?.role}` }, { status: 403 });
        }

        // Define which templates each role can manage
        const rolePermissions: Record<string, string[]> = {
            superadmin: [EmailTemplateType.VERIFY_EMAIL, EmailTemplateType.WELCOME_PHOTOGRAPHER, EmailTemplateType.PLAN_UPDATED],
            admin: [EmailTemplateType.CUSTOMER_STATUS_UPDATE, EmailTemplateType.PLAN_UPDATED]
        };

        const allowedTypes = rolePermissions[user.role] || [];
        console.log(`[EmailTemplates] Allowed types for ${user.role}:`, allowedTypes);

        // Get custom templates
        // Superadmins look for templates with their ID or null (global)
        const query = user.role === 'superadmin'
            ? { $or: [{ photographerId: user._id }, { photographerId: null }] }
            : { photographerId: user._id };

        const customTemplates = await EmailTemplate.find(query);
        console.log(`[EmailTemplates] Found ${customTemplates.length} custom templates`);

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
