import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            name?: string;
            role: 'superadmin' | 'admin' | 'couple';
            customerId?: string;
            storageUsage: number;
            storageLimit: number;
            studioName?: string;
            subscriptionExpiry?: string;
            packageType?: 'trial' | 'standart' | 'kurumsal';
            panelSettings?: {
                defaultView?: string;
            };
            hasCompletedOnboarding?: boolean;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        name?: string;
        role: 'superadmin' | 'admin' | 'couple';
        customerId?: string;
        storageUsage: number;
        storageLimit: number;
        studioName?: string;
        subscriptionExpiry?: string;
        packageType?: 'trial' | 'standart' | 'kurumsal';
        panelSettings?: {
            defaultView?: string;
        };
        hasCompletedOnboarding?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name?: string;
        role: 'superadmin' | 'admin' | 'couple';
        customerId?: string;
        storageUsage: number;
        storageLimit: number;
        studioName?: string;
        subscriptionExpiry?: string;
        packageType?: 'trial' | 'standart' | 'kurumsal';
        panelSettings?: {
            defaultView?: string;
        };
        hasCompletedOnboarding?: boolean;
    }
}
