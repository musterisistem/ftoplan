import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

import { render } from '@react-email/render';

export const sendEmail = async ({
    to,
    subject,
    react,
    html: rawHtml,
}: {
    to: string | string[];
    subject: string;
    react?: React.ReactElement;
    html?: string;
}) => {
    try {
        console.log(`[Resend] Rendering email for: ${to}`);

        // Use provided HTML or render React component
        const html = rawHtml || (react ? await render(react) : '');

        if (!html) {
            throw new Error('Either react or html parameter must be provided');
        }

        console.log(`[Resend] Sending email to: ${to} | Subject: ${subject}`);
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Weey.NET <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('[Resend] API Error:', error);
            return { success: false, error };
        }

        console.log('[Resend] Email sent successfully. ID:', data?.id);
        return { success: true, data };
    } catch (error) {
        console.error('[Resend] Unexpected Error:', error);
        return { success: false, error };
    }
};

/**
 * Send email using custom template system
 */
export const sendEmailWithTemplate = async ({
    to,
    templateType,
    data,
    photographerId,
}: {
    to: string | string[];
    templateType: string;
    data: Record<string, any>;
    photographerId: string;
}) => {
    try {
        const dbConnect = (await import('@/lib/mongodb')).default;
        const EmailTemplate = (await import('@/models/EmailTemplate')).default;
        const { buildEmailFromCustomization } = await import('@/lib/emailTemplateCustomization');
        const { DEFAULT_CUSTOMIZATIONS } = await import('@/lib/emailTemplateCustomization');
        const { replaceVariables } = await import('@/lib/emailTemplates');

        await dbConnect();

        // Find custom template (prioritize photographer specific, then system-wide/global)
        const customTemplate = await EmailTemplate.findOne({
            $or: [
                { photographerId: photographerId },
                { photographerId: null }
            ],
            templateType,
            isActive: true
        }).sort({ photographerId: -1 }); // Sort so that non-null (specific) comes first

        let customization;

        if (customTemplate) {
            // Use custom customization (stored as JSON in htmlContent field)
            try {
                customization = JSON.parse(customTemplate.htmlContent);
            } catch (e) {
                console.error('Failed to parse custom template, using default:', e);
                customization = DEFAULT_CUSTOMIZATIONS[templateType as keyof typeof DEFAULT_CUSTOMIZATIONS];
            }
        } else {
            // Use default customization
            customization = DEFAULT_CUSTOMIZATIONS[templateType as keyof typeof DEFAULT_CUSTOMIZATIONS];
        }

        // Build email from customization
        const { subject: templateSubject, htmlContent: templateHtml } = buildEmailFromCustomization(
            templateType as keyof typeof DEFAULT_CUSTOMIZATIONS,
            customization,
            data
        );

        // Replace variables in both subject and HTML
        const finalSubject = replaceVariables(templateSubject, data);
        const finalHtml = replaceVariables(templateHtml, data);

        // Send email
        return await sendEmail({
            to,
            subject: finalSubject,
            html: finalHtml
        });
    } catch (error) {
        console.error('[EmailTemplate] Error:', error);
        return { success: false, error };
    }
};

export default resend;
