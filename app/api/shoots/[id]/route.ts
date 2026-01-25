import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Shoot from '@/models/Shoot';
import Customer from '@/models/Customer';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await dbConnect();
    try {
        const shoot = await Shoot.findById(params.id).populate('customerId');
        if (!shoot) {
            return NextResponse.json({ error: 'Shoot not found' }, { status: 404 });
        }
        return NextResponse.json(shoot);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    try {
        const body = await req.json();
        const { date, type, location, city, packageId, contractId, agreedPrice, deposit, notes, customerData } = body;

        // Update Shoot
        const shoot = await Shoot.findByIdAndUpdate(
            params.id,
            {
                date,
                type,
                location,
                city,
                packageId,
                contractId,
                agreedPrice,
                deposit,
                notes
            },
            { new: true }
        );

        if (!shoot) {
            return NextResponse.json({ error: 'Shoot not found' }, { status: 404 });
        }

        // Specifically update Customer info if provided (for bride/groom name changes etc)
        if (customerData && shoot.customerId) {
            await Customer.findByIdAndUpdate(shoot.customerId, {
                brideName: customerData.brideName,
                groomName: customerData.groomName,
                phone: customerData.phone,
                email: customerData.email,
                tcId: customerData.tcId
            });
        }

        return NextResponse.json(shoot);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    try {
        const shoot = await Shoot.findByIdAndDelete(params.id);
        if (!shoot) {
            return NextResponse.json({ error: 'Shoot not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Shoot deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
