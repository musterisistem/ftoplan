import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
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
            isActive?: boolean;
            isEmailVerified?: boolean;
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
        isActive?: boolean;
        isEmailVerified?: boolean;
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
        isActive?: boolean;
        isEmailVerified?: boolean;
    }
}
