import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

/**
 * POST /api/superadmin/audit-verification
 * 
 * Scans all admin users and locks those with explicitly unverified emails.
 * - isEmailVerified: false → set isActive: false (LOCKED)
 * - isEmailVerified: undefined/null → leave unchanged (old users, grandfathered in)
 * - isEmailVerified: true → set isActive: true (ensure active)
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Sadece superadmin erişebilir.' }, { status: 403 });
        }

        await dbConnect();

        // 1. Lock users with explicitly unverified email (isEmailVerified: false)
        const lockResult = await User.updateMany(
            {
                role: 'admin',
                isEmailVerified: false, // strictly false, not undefined/null
                isActive: { $ne: false } // don't touch already locked
            },
            { $set: { isActive: false } }
        );

        // 2. Activate users who have verified their email (ensure consistency)
        const activateResult = await User.updateMany(
            {
                role: 'admin',
                isEmailVerified: true,
                isActive: false // currently locked but should be active
            },
            { $set: { isActive: true } }
        );

        // 3. Report
        const allAdmins = await User.find({ role: 'admin' })
            .select('email name isEmailVerified isActive createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const locked = allAdmins.filter(u => u.isActive === false);
        const active = allAdmins.filter(u => u.isActive !== false);
        const unset = allAdmins.filter(u => u.isEmailVerified == null); // grandfathered

        return NextResponse.json({
            success: true,
            summary: {
                totalAdmins: allAdmins.length,
                nowLocked: lockResult.modifiedCount,
                nowActivated: activateResult.modifiedCount,
                currentlyLocked: locked.length,
                currentlyActive: active.length,
                grandfathered: unset.length,
            },
            locked: locked.map(u => ({ email: u.email, name: u.name, isEmailVerified: u.isEmailVerified })),
            grandfathered: unset.map(u => ({ email: u.email, name: u.name })),
        });

    } catch (error: any) {
        console.error('Audit verification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/superadmin/audit-verification
 * Read-only: just list the current state without making changes
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Sadece superadmin erişebilir.' }, { status: 403 });
        }

        await dbConnect();

        const allAdmins = await User.find({ role: 'admin' })
            .select('email name isEmailVerified isActive createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            total: allAdmins.length,
            verified: allAdmins.filter(u => u.isEmailVerified === true).length,
            unverified: allAdmins.filter(u => u.isEmailVerified === false).length,
            grandfathered: allAdmins.filter(u => u.isEmailVerified == null).length,
            locked: allAdmins.filter(u => u.isActive === false).length,
            users: allAdmins.map(u => ({
                email: u.email,
                name: u.name,
                isEmailVerified: u.isEmailVerified ?? 'grandfathered',
                isActive: u.isActive,
                createdAt: u.createdAt,
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
