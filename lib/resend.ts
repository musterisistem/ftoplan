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
            from: process.env.EMAIL_FROM || 'Kadraj Panel <onboarding@resend.dev>',
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

export default resend;
