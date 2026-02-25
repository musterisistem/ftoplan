import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LandingPageClient from './LandingPageClient';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    if (session.user.role === 'superadmin') redirect('/superadmin/dashboard');
    else if (session.user.role === 'admin') redirect('/admin/dashboard');
    else redirect('/client/dashboard');
  }
  return <LandingPageClient />;
}
