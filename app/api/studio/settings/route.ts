import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const formData = await req.formData();

        const studioName = formData.get('studioName') as string;
        const photographerName = formData.get('photographerName') as string;

        // Logo Files
        const logoFile = formData.get('logo') as File | null;
        const panelLogoFile = formData.get('panelLogo') as File | null;
        const siteLogoLightFile = formData.get('siteLogoLight') as File | null;
        const siteLogoDarkFile = formData.get('siteLogoDark') as File | null;

        const updateData: any = {
            studioName,
            name: photographerName
        };

        // Helper to handle upload
        const handleUpload = async (file: File, prefix: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${prefix}-${session.user.id}-${Date.now()}${path.extname(file.name)}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
            await writeFile(path.join(uploadDir, filename), buffer);
            return `/uploads/logos/${filename}`;
        };

        // Handle Legacy/Fallback Logo
        if (logoFile && logoFile.size > 0) {
            updateData.logo = await handleUpload(logoFile, 'logo');
        }

        // Handle NEW Panel Logo (Sidebar)
        if (panelLogoFile && panelLogoFile.size > 0) {
            updateData.panelLogo = await handleUpload(panelLogoFile, 'panel-logo');
            // Backwards compatibility: Update main logo too if it wasn't sent specifically
            if (!logoFile) updateData.logo = updateData.panelLogo;
        }

        // Handle Site Logos
        if (siteLogoLightFile && siteLogoLightFile.size > 0) {
            updateData.siteLogoLight = await handleUpload(siteLogoLightFile, 'site-logo-light');
        }
        if (siteLogoDarkFile && siteLogoDarkFile.size > 0) {
            updateData.siteLogoDark = await handleUpload(siteLogoDarkFile, 'site-logo-dark');
        }

        // Handle Status Arrays and Other Settings
        const settingsJson = formData.get('settings');
        if (settingsJson) {
            const settings = JSON.parse(settingsJson as string);
            updateData.panelSettings = settings;
        }

        // Handle Other Theme Settings (from Theme Page)
        const themeSettingsJson = formData.get('themeSettings');
        if (themeSettingsJson) {
            const themeSettings = JSON.parse(themeSettingsJson as string);
            updateData.siteTheme = themeSettings.siteTheme;
            updateData.primaryColor = themeSettings.primaryColor;
            updateData.heroTitle = themeSettings.heroTitle;
            updateData.heroSubtitle = themeSettings.heroSubtitle;
            updateData.logo = themeSettings.logo || updateData.logo; // Keep existing logical flow for basic settings
            updateData.bannerImage = themeSettings.bannerImage;
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.user.id).select('studioName name logo panelLogo siteLogoLight siteLogoDark panelSettings siteTheme primaryColor heroTitle heroSubtitle bannerImage');

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(user);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
