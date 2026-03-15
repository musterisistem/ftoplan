import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 md:bg-[#08050f]">
            <Loader2 className="w-9 h-9 animate-spin text-[#5d2b72]" />
        </div>
    );
}
