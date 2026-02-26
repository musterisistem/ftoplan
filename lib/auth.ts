import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // SUPER ADMIN: System owner with full access
                if (credentials?.email === 'musterisistem@gmail.com' && credentials?.password === '3280914Orhan2427--') {
                    return {
                        id: 'superadmin-id',
                        email: 'musterisistem@gmail.com',
                        name: 'Sistem Yöneticisi',
                        role: 'superadmin',
                        storageUsage: 0,
                        storageLimit: 0, // Unlimited for superadmin
                    };
                }

                // DEVELOPMENT ONLY: Hardcoded photographer for testing
                if (credentials?.email === 'admin@weey.net' && credentials?.password === 'admin123') {
                    return {
                        id: 'dev-admin-id',
                        email: 'admin@weey.net',
                        name: 'Test Fotoğrafçı',
                        studioName: 'Weey.NET Fotoğrafçılık',
                        role: 'admin', // admin = photographer
                        storageUsage: 0,
                        storageLimit: 21474836480,
                    };
                }

                try {
                    await dbConnect();
                } catch (error) {
                    console.error("Database connection failed:", error);
                    throw new Error('Veritabanı bağlantısı sağlanamadı.');
                }

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email/Kullanıcı adı ve şifre gereklidir');
                }

                // First try to find by email
                let user = await User.findOne({ email: credentials.email });

                // If not found by email, try to find customer by plainUsername
                if (!user) {
                    const Customer = (await import('@/models/Customer')).default;
                    const customer = await Customer.findOne({ plainUsername: credentials.email });

                    if (customer && customer.userId) {
                        user = await User.findById(customer.userId);

                        // Check if user is blocked
                        if (user?.isBlocked) {
                            throw new Error('Hesabınız engellenmiştir. Lütfen fotoğrafçınız ile iletişime geçin.');
                        }

                        // Check plainPassword directly (stored for customer login)
                        if (customer.plainPassword === credentials.password) {
                            if (user) {
                                return {
                                    id: user._id.toString(),
                                    email: user.email,
                                    name: customer.brideName + (customer.groomName ? ' & ' + customer.groomName : ''),
                                    role: 'couple',
                                    customerId: customer._id.toString(),
                                    storageUsage: 0,
                                    storageLimit: 0,
                                };
                            }
                        } else {
                            throw new Error('Hatalı şifre');
                        }
                    }
                }

                if (!user) {
                    throw new Error('Kullanıcı bulunamadı');
                }

                // Global Block Check (Customers)
                if (user.role === 'couple' && user.isBlocked) {
                    throw new Error('Hesabınız engellenmiştir. Lütfen fotoğrafçınız ile iletişime geçin.');
                }

                // Note: Email verification is now handled by the in-panel EmailVerificationGate overlay
                // Users can log in with isActive:false and will see the gate in their dashboard

                // Standard password check with bcrypt for admin/superadmin users
                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordMatch) {
                    throw new Error('Hatalı şifre');
                }

                // Auto-fix for existing users: Set subscription expiry if missing
                if (user.role === 'admin' && !user.subscriptionExpiry) {
                    const expiryDate = new Date(user.createdAt || Date.now());
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

                    user.subscriptionExpiry = expiryDate;
                    await user.save();
                }

                // FORCE SUPERADMIN ROLE for specific email
                // This ensures that even if the DB says 'admin' or they changed password, they get superadmin access
                const finalRole = user.email === 'musterisistem@gmail.com' ? 'superadmin' : user.role;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || '',
                    role: finalRole,
                    customerId: user.customerId?.toString(),
                    storageUsage: user.storageUsage || 0,
                    storageLimit: user.storageLimit || 21474836480,
                    studioName: user.studioName,
                    subscriptionExpiry: user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toISOString() : undefined,
                    packageType: user.packageType || 'trial',
                    image: user.panelLogo || user.logo || '',
                    panelSettings: user.panelSettings || undefined,
                    hasCompletedOnboarding: user.hasCompletedOnboarding || false,
                    isActive: user.isActive !== false,
                    isEmailVerified: user.isEmailVerified === true,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.role = user.role;
                token.customerId = user.customerId;
                token.id = user.id;
                token.storageUsage = user.storageUsage;
                token.storageLimit = user.storageLimit;
                token.studioName = user.studioName;
                token.subscriptionExpiry = user.subscriptionExpiry;
                token.packageType = user.packageType;
                token.picture = user.image;
                token.panelSettings = user.panelSettings;
                token.hasCompletedOnboarding = user.hasCompletedOnboarding;
                token.isActive = user.isActive;
                token.isEmailVerified = user.isEmailVerified;
            }

            // REFRESH DATA ON NAVIGATION/UPDATE
            // Always fetch fresh data for storage usage (and LOGO) to ensure UI is live
            try {
                await dbConnect();

                if (token.email && token.role === 'admin') {
                    // Update: Select panelLogo and panelSettings
                    const adminUser = await User.findOne({ email: token.email }).select('storageUsage storageLimit studioName subscriptionExpiry packageType logo panelLogo panelSettings isActive isEmailVerified');

                    if (adminUser) {
                        token.storageUsage = adminUser.storageUsage || 0;
                        token.storageLimit = adminUser.storageLimit || 21474836480;
                        token.studioName = adminUser.studioName || '';
                        token.subscriptionExpiry = adminUser.subscriptionExpiry?.toISOString() || null;
                        token.packageType = adminUser.packageType || 'trial';
                        // Logic: Use panelLogo if available, otherwise fallback to logo
                        token.picture = adminUser.panelLogo || adminUser.logo || '';
                        token.panelSettings = adminUser.panelSettings || undefined;
                        token.hasCompletedOnboarding = adminUser.hasCompletedOnboarding || false;
                        token.isActive = adminUser.isActive !== false;
                        token.isEmailVerified = adminUser.isEmailVerified === true;
                    }
                }
            } catch (error) {
                console.error('Error refreshing token data:', error);
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role;
                session.user.customerId = token.customerId;
                session.user.id = token.id;
                session.user.storageUsage = token.storageUsage;
                session.user.storageLimit = token.storageLimit;
                session.user.studioName = token.studioName;
                session.user.subscriptionExpiry = token.subscriptionExpiry;
                session.user.packageType = token.packageType;
                session.user.image = token.picture; // Explicitly map image
                session.user.panelSettings = token.panelSettings;
                session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
                session.user.isActive = token.isActive;
                session.user.isEmailVerified = token.isEmailVerified;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
