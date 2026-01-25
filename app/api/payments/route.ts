import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (session.user.role === 'couple') {
        if (session.user.customerId !== customerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
    }

    try {
        const payment = await Payment.findOne({ customerId });
        if (!payment) {
            return NextResponse.json({ payments: [], contractTotal: 0, balance: 0 });
        }
        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const { customerId, actionType, amount, type, description, date, name, isDebit } = body;

        let paymentRecord = await Payment.findOne({ customerId });

        if (!paymentRecord) {
            paymentRecord = await Payment.create({
                customerId,
                contractTotal: 0,
                payments: [],
                extras: []
            });
        }

        if (actionType === 'payment') {
            paymentRecord.payments.push({
                amount: Number(amount),
                date: new Date(date || Date.now()),
                type: type || 'nakit',
                description: description || ''
            });
        } else if (actionType === 'extra') {
            paymentRecord.extras.push({
                name: name,
                amount: Number(amount),
                isDebit: isDebit !== undefined ? isDebit : true,
                date: new Date(date || Date.now()),
                description: description || ''
            });
        }

        await paymentRecord.save();

        return NextResponse.json(paymentRecord, { status: 201 });
    } catch (error: any) {
        console.error('Payment API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to add record' }, { status: 500 });
    }
}
