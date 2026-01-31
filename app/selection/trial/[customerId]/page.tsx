import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import TrialSelectionClient from '@/components/studio/TrialSelectionClient';

export default async function TrialSelectionPage({ params }: { params: Promise<{ customerId: string }> }) {
    const { customerId } = await params;
    await dbConnect();

    // Fetch customer
    const customer = await Customer.findById(customerId).populate('photographerId');
    if (!customer) {
        return redirect('/404');
    }

    // Check if photographer is in trial mode (or allow this page for everyone as a backup)
    const photographer = customer.photographerId as any;
    // We allow it anyway as it's the "trial link"

    // Prepare photos data
    const photos = customer.photos || [];

    return (
        <TrialSelectionClient
            customer={JSON.parse(JSON.stringify(customer))}
            photos={JSON.parse(JSON.stringify(photos))}
            photographer={JSON.parse(JSON.stringify(photographer))}
        />
    );
}
