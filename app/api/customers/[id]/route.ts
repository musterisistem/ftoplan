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
        console.log('Fetching customer with ID:', id);
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }
        console.log(`GET Customer ${id}, photos count: ${customer.photos?.length || 0}`);

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

        if (customer.photographerId) {
            const photographer = await User.findById(customer.photographerId).select('slug packageType subscriptionExpiry');
            if (photographer) {
                photographerSlug = photographer.slug;
                photographerPackageType = photographer.packageType || 'trial';
                photographerSubscriptionExpiry = photographer.subscriptionExpiry;
            }
        }

        return NextResponse.json({
            ...customer.toObject(),
            user: userInfo,
            photographerSlug,
            photographerPackageType,
            photographerSubscriptionExpiry
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
        const body = await req.json();
        const { brideName, groomName, phone, email, notes, status, appointmentStatus, albumStatus, tcId } = body;

        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
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
                const newUserEmail = `${body.plainUsername}@fotopanel.com`;
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
        if (isStatusChanged && updatedCustomer?.email) {
            try {
                const { sendEmail } = await import('@/lib/resend');
                const { CustomerStatusUpdate } = await import('@/lib/emails/CustomerStatusUpdate');

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

                await sendEmail({
                    to: updatedCustomer.email,
                    subject: `FotoPlan - ${changedStatus.title} Güncellendi`,
                    react: CustomerStatusUpdate({
                        customerName: `${updatedCustomer.brideName} & ${updatedCustomer.groomName}`,
                        statusTitle: changedStatus.title,
                        statusValue: changedStatus.value,
                        studioName: photographer?.studioName || 'Fotoğraf Stüdyonuz'
                    })
                });
            } catch (err) {
                console.error('Failed to send status update email:', err);
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
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
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
