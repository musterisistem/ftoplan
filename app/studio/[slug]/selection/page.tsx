import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import SelectionClient from './SelectionClient';
import { getCustomerSession } from '@/lib/customerAuth';

export default async function SelectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const customerSession = await getCustomerSession();
    const { slug } = await params;

    if (!customerSession || !customerSession.customerId) {
        redirect(`/studio/${slug}`);
    }

    await dbConnect();
    const customer = await Customer.findById(customerSession.customerId);

    if (!customer) {
        return <div className="text-center text-white p-20">Müşteri kaydı bulunamadı.</div>;
    }

    // Serialize generic object to pass to client
    const serializedCustomer = JSON.parse(JSON.stringify(customer));

    // Fetch the provider (photographer) to get settings like success text and theme
    const providerId = customer.photographerId || customer.userId;
    let selectionSuccessMessage = undefined;
    let siteTheme = 'warm'; // Default

    if (providerId) {
        const User = (await import('@/models/User')).default;
        const provider = await User.findById(providerId).select('selectionSuccessMessage siteTheme');
        if (provider) {
            selectionSuccessMessage = provider.selectionSuccessMessage;
            siteTheme = provider.siteTheme || 'warm';
        }
    }

    // Determine Theme Colors
    const isLight = siteTheme === 'light';
    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const subTextColor = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} font-sans`}>
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            <main className="pt-24 pb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-syne mb-4">Fotoğraf Seçim Paneli</h1>
                <p className={`text-xl ${subTextColor} max-w-2xl mx-auto mb-8`}>
                    Hoşgeldiniz {customerSession.name}. Lütfen aşağıdaki panelden seçimlerinizi yapın.
                </p>

                <SelectionClient
                    customer={serializedCustomer}
                    photos={serializedCustomer.photos || []}
                    selectionSuccessMessage={selectionSuccessMessage}
                    theme={siteTheme} // Pass theme to client
                />
            </main>
        </div>
    );
}
