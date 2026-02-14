import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { markAllNotificationsAsRead } from '@/lib/notifications';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        // Get photographer ID from session
        const user = await User.findOne({ email: session.user.email, role: 'admin' });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = await markAllNotificationsAsRead(user._id.toString());

        return NextResponse.json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error: any) {
        console.error('Error marking all notifications as read:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
