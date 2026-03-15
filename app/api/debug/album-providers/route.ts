import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AlbumProvider from '@/models/AlbumProvider';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Kullanıcıyı bul
        const user = await User.findOne({ email: 'diyareme@gmail.com' });
        
        if (!user) {
            return NextResponse.json({ 
                error: 'Kullanıcı bulunamadı',
                email: 'diyareme@gmail.com'
            }, { status: 404 });
        }

        // 2. Bu kullanıcının albüm tedarikçilerini bul
        const providers = await AlbumProvider.find({ photographerId: user._id });

        // 3. Tüm tedarikçileri bul
        const allProviders = await AlbumProvider.find({});

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                studioName: user.studioName,
                role: user.role
            },
            userProviders: providers.map(p => ({
                id: p._id.toString(),
                name: p.name,
                isActive: p.isActive,
                coversCount: p.covers?.length || 0,
                covers: p.covers || [],
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            })),
            totalProvidersInSystem: allProviders.length,
            allProviders: allProviders.map(p => ({
                id: p._id.toString(),
                name: p.name,
                photographerId: p.photographerId.toString(),
                coversCount: p.covers?.length || 0
            }))
        });

    } catch (error: any) {
        console.error('Debug error:', error);
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
