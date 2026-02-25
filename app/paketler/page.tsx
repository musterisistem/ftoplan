import { redirect } from 'next/navigation';

// /paketler → /packages yönlendirmesi
export default function PaketlerPage() {
    redirect('/packages');
}
