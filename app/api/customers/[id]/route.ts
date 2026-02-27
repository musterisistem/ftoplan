import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Ownership check for admin users
        if (session?.user?.role === 'admin') {
            const adminUser = await User.findOne({ email: session.user.email, role: 'admin' });
            if (!adminUser || customer.photographerId?.toString() !== adminUser._id.toString()) {
                return NextResponse.json({ error: 'Bu müşteriye erişim yetkiniz yok' }, { status: 403 });
            }
        }

        // Get user info if exists
        let userInfo = null;
        if (customer.userId) {
            const user = await User.findById(customer.userId).select('email isActive');
            if (user) {
                // Extract simple username from email if plainUsername doesn't exist
                const simpleUsername = customer.plainUsername || (user.email ? user.email.split('@')[0] : null);

                userInfo = {
                    email: user.email,
                    plainPassword: customer.plainPassword || null,
                    plainUsername: simpleUsername, // Use stored or extract from email
                    isActive: user.isActive !== undefined ? user.isActive : true
                };
            }
        }

        // Get photographer info for studio slug and trial status
        let photographerSlug = null;
        let photographerPackageType = 'trial';
        let photographerSubscriptionExpiry = null;
        let photographerName = null;
        let photographerStudioName = null;

        if (customer.photographerId) {
            const photographer = await User.findById(customer.photographerId).select('slug packageType subscriptionExpiry name studioName');
            if (photographer) {
                photographerSlug = photographer.slug;
                photographerPackageType = photographer.packageType || 'trial';
                photographerSubscriptionExpiry = photographer.subscriptionExpiry;
                photographerName = photographer.name;
                photographerStudioName = photographer.studioName;
            }
        }

        return NextResponse.json({
            ...customer.toObject(),
            user: userInfo,
            photographerSlug,
            photographerPackageType,
            photographerSubscriptionExpiry,
            photographerName,
            photographerStudioName
        });
    } catch (error: any) {
        console.error('Error fetching customer:', error);
        return NextResponse.json({ error: 'Müşteri getirilemedi: ' + error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { brideName, groomName, phone, email, notes, status, appointmentStatus, albumStatus, tcId } = body;

        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Ownership check for admin users
        if (session?.user?.role === 'admin') {
            const adminUser = await User.findOne({ email: session.user.email, role: 'admin' });
            if (!adminUser || customer.photographerId?.toString() !== adminUser._id.toString()) {
                return NextResponse.json({ error: 'Bu müşteriye erişim yetkiniz yok' }, { status: 403 });
            }
        }

        // Check email uniqueness if changed
        if (email && email !== customer.email) {
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return NextResponse.json({ error: 'Bu email adresi başka bir müşteri tarafından kullanılıyor' }, { status: 400 });
            }

            // Also check User model
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== customer.userId?.toString()) {
                return NextResponse.json({ error: 'Bu email adresi bir kullanıcı hesabında kullanılıyor' }, { status: 400 });
            }

            // Update linked User email
            if (customer.userId) {
                await User.findByIdAndUpdate(customer.userId, { email });
            }
        }

        // Build update object with only provided fields
        const updateData: any = {};
        if (brideName !== undefined) updateData.brideName = brideName;
        if (groomName !== undefined) updateData.groomName = groomName;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (notes !== undefined) updateData.notes = notes;
        if (status !== undefined) updateData.status = status;
        if (appointmentStatus !== undefined) updateData.appointmentStatus = appointmentStatus;
        if (status !== undefined) updateData.status = status;
        if (appointmentStatus !== undefined) updateData.appointmentStatus = appointmentStatus;
        if (albumStatus !== undefined) {
            updateData.albumStatus = albumStatus;
            // Set deliveredAt if status is 'teslim_edildi'
            if (albumStatus === 'teslim_edildi') {
                updateData.deliveredAt = new Date();
            } else if (customer.albumStatus === 'teslim_edildi' && albumStatus !== 'teslim_edildi') {
                // Reset if moved away from delivered (optional, but safer)
                updateData.deliveredAt = null;
            }
        }
        if (tcId !== undefined) updateData.tcId = tcId;
        if (body.contractId !== undefined) updateData.contractId = body.contractId;

        // Selection Logic Updates
        if (body.selectionLimits !== undefined) updateData.selectionLimits = body.selectionLimits;
        if (body.selectedPhotos !== undefined) updateData.selectedPhotos = body.selectedPhotos;
        if (body.selectionCompleted !== undefined) updateData.selectionCompleted = body.selectionCompleted;
        if (body.canDownload !== undefined) updateData.canDownload = body.canDownload;

        // Check if photo selection was just completed FOR THE FIRST TIME by the CUSTOMER
        // (not triggered by admin panel saves - requires source: 'customer')
        const wasSelectionJustCompleted =
            body.source === 'customer' &&
            body.selectionCompleted === true &&
            customer.selectionCompleted === false;

        // If selection was just completed by the customer, lock the timestamp
        if (wasSelectionJustCompleted) {
            updateData.selectionApprovedAt = new Date();
        }

        // Sync with User Model if credentials or status changed
        if (customer.userId) {
            const userUpdate: any = {};
            if (email && email !== customer.email) userUpdate.email = email;
            if (body.isActive !== undefined) userUpdate.isActive = body.isActive;

            // Handle Password Change
            if (body.plainPassword && body.plainPassword !== customer.plainPassword) {
                userUpdate.password = await bcrypt.hash(body.plainPassword, 10);
                updateData.plainPassword = body.plainPassword;
            }

            // Handle Username Change (mapped to email for login mostly)
            if (body.plainUsername && body.plainUsername !== customer.plainUsername) {
                updateData.plainUsername = body.plainUsername;
                // If we use email-based login, and generate email from username:
                const newUserEmail = `${body.plainUsername}@weey.net`;
                userUpdate.email = newUserEmail;
                updateData.email = newUserEmail; // Also update customer email to match
            }

            if (Object.keys(userUpdate).length > 0) {
                await User.findByIdAndUpdate(customer.userId, { $set: userUpdate });
            }
        }

        // Detect Status Changes for Email Notification
        const isStatusChanged =
            (appointmentStatus !== undefined && appointmentStatus !== customer.appointmentStatus) ||
            (albumStatus !== undefined && albumStatus !== customer.albumStatus);

        // Use findByIdAndUpdate to skip validation on missing fields
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: false } // Skip validators for backward compatibility
        );

        // Send Email Notification if Status Changed and Email exists
        if (isStatusChanged && updatedCustomer?.email && updatedCustomer?.photographerId) {
            try {
                const { sendEmailWithTemplate } = await import('@/lib/resend');
                const { EmailTemplateType } = await import('@/models/EmailTemplate');

                // Get Photographer Studio Name
                const photographer = await User.findById(updatedCustomer.photographerId).select('studioName');

                // Map Enum to User Friendly Turkish Titles
                const statusMap: any = {
                    'cekim_yapilmadi': 'Çekim Henüz Yapılmadı',
                    'cekim_yapildi': 'Çekim Tamamlandı',
                    'fotograflar_yuklendi': 'Fotoğraflar Panele Yüklendi',
                    'fotograflar_secildi': 'Fotoğraflar Müşteri Tarafından Seçildi',
                    'album_bekleniyor': 'Albüm Onayı Bekleniyor',
                    'teslim_edildi': 'Süreç Tamamlandı / Teslim Edildi',
                    // Album Status
                    'islem_yapilmadi': 'İşlem Sırasında',
                    'tasarim_asamasinda': 'Albüm Tasarımı Aşamasında',
                    'baskida': 'Baskı Merkezinde',
                    'paketlemede': 'Paketleme Aşamasında',
                    'kargoda': 'Kargoya Verildi',
                    'teslimata_hazir': 'Teslimata Hazır',
                };

                const changedStatus = appointmentStatus !== undefined && appointmentStatus !== customer.appointmentStatus
                    ? { title: 'Randevu Durumu', value: statusMap[appointmentStatus] || appointmentStatus }
                    : { title: 'Albüm Durumu', value: statusMap[albumStatus] || albumStatus };

                await sendEmailWithTemplate({
                    to: updatedCustomer.email,
                    templateType: EmailTemplateType.CUSTOMER_STATUS_UPDATE,
                    photographerId: updatedCustomer.photographerId.toString(),
                    data: {
                        customerName: `${updatedCustomer.brideName} & ${updatedCustomer.groomName}`,
                        statusTitle: changedStatus.title,
                        statusValue: changedStatus.value,
                        studioName: photographer?.studioName || 'Fotoğraf Stüdyonuz'
                    }
                });
            } catch (err) {
                console.error('Failed to send status update email:', err);
            }
        }

        // Create Notification for Photo Selection Completion
        if (wasSelectionJustCompleted && updatedCustomer?.photographerId) {
            try {
                const { createNotification } = await import('@/lib/notifications');
                const { NotificationType } = await import('@/models/Notification');

                await createNotification({
                    type: NotificationType.PHOTO_SELECTION,
                    userId: updatedCustomer.photographerId.toString(),
                    customerId: updatedCustomer._id.toString(),
                    relatedId: updatedCustomer._id.toString(),
                    customerName: `${updatedCustomer.brideName} & ${updatedCustomer.groomName}`,
                });
            } catch (err) {
                console.error('Failed to create photo selection notification:', err);
            }
        }

        if (!updatedCustomer) {
            return NextResponse.json({ error: 'Güncelleme sonrası müşteri bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(updatedCustomer);
    } catch (error: any) {
        console.error('Update customer error:', error);
        return NextResponse.json({ error: error.message || 'Güncelleme başarısız' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Ownership check for admin users
        if (session?.user?.role === 'admin') {
            const adminUser = await User.findOne({ email: session.user.email, role: 'admin' });
            if (!adminUser || customer.photographerId?.toString() !== adminUser._id.toString()) {
                return NextResponse.json({ error: 'Bu müşteriye erişim yetkiniz yok' }, { status: 403 });
            }
        }

        // Delete linked User first
        if (customer.userId) {
            await User.findByIdAndDelete(customer.userId);
        }

        // Delete customer
        await Customer.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Müşteri ve kullanıcı hesabı silindi' });
    } catch (error) {
        console.error('Delete customer error:', error);
        return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
    }
}
