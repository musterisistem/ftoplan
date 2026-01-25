import CustomerManageClient from './CustomerManageClient';

export default async function CustomerManagePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const customerId = resolvedParams.id;

    return <CustomerManageClient customerId={customerId} />;
}
