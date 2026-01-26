import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import SelectionClient from './SelectionClient';

export default async function SelectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.customerId) {
        redirect(`/studio/${(await params).slug}`);
    }

    await dbConnect();
    const customer = await Customer.findById(session.user.customerId);

    if (!customer) {
        return <div className="text-center text-white p-20">Müşteri kaydı bulunamadı.</div>;
    }

    // Serialize generic object to pass to client
    const serializedCustomer = JSON.parse(JSON.stringify(customer));

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            <main className="pt-24 pb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-syne mb-4">Fotoğraf Seçim Paneli</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                    Hoşgeldiniz {session.user.name}. Lütfen aşağıdaki panelden seçimlerinizi yapın.
                </p>

                <SelectionClient
                    customer={serializedCustomer}
                    photos={serializedCustomer.photos || []}
                />
            </main>
        </div>
    );
}
