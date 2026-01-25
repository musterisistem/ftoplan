import Calendar from '@/components/admin/Calendar';

export default function CalendarPage() {
    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Çekim Takvimi</h1>
                <p className="mt-1 text-sm text-gray-500">Tüm çekimlerinizi buradan planlayın ve takip edin.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <Calendar />
            </div>
        </div>
    );
}
