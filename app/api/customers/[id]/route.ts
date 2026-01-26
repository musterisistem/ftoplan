import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';

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
            const user = await User.findById(customer.userId).select('email');
            if (user) {
                // Extract simple username from email if plainUsername doesn't exist
                const simpleUsername = customer.plainUsername || (user.email ? user.email.split('@')[0] : null);

                userInfo = {
                    email: user.email,
                    plainPassword: customer.plainPassword || null,
                    plainUsername: simpleUsername, // Use stored or extract from email
                };
            }
        }

        // Get photographer info for studio slug
        let photographerSlug = null;
        if (customer.photographerId) {
            const photographer = await User.findById(customer.photographerId).select('slug');
            if (photographer?.slug) {
                photographerSlug = photographer.slug;
            }
        }

        return NextResponse.json({
            ...customer.toObject(),
            user: userInfo,
            photographerSlug
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
        const { brideName, groomName, phone, email, notes, status, appointmentStatus, albumStatus } = body;

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
        if (albumStatus !== undefined) updateData.albumStatus = albumStatus;

        // Selection Logic Updates
        if (body.selectionLimits !== undefined) updateData.selectionLimits = body.selectionLimits;
        if (body.selectedPhotos !== undefined) updateData.selectedPhotos = body.selectedPhotos;
        if (body.selectionCompleted !== undefined) updateData.selectionCompleted = body.selectionCompleted;

        // Use findByIdAndUpdate to skip validation on missing fields
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: false } // Skip validators for backward compatibility
        );

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
