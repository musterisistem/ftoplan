import CustomerForm from '@/components/admin/CustomerForm';

export default function NewCustomerPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Yeni Müşteri Ekle</h1>
                <p className="mt-1 text-sm text-gray-500">Sisteme yeni bir çift kaydı oluşturun.</p>
            </div>
            <CustomerForm />
        </div>
    );
}
