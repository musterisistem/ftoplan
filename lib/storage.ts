import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';

/**
 * Recalculates the total storage usage for the system (or specific user)
 * primarily for the admin user who owns the quota.
 * 
 * Logic:
 * 1. Find all Customers.
 * 2. Sum up the `size` of all photos in their `photos` array.
 * 3. Update the Admin User's `storageUsage` with this exact sum.
 * 
 * This ensures "Real Data" is always reflected, correcting any drift from incremental updates.
 */
export async function syncStorageUsage() {
    try {
        await dbConnect();

        // 1. Calculate total size from all customers
        const result = await Customer.aggregate([
            {
                $project: {
                    totalSize: { $sum: "$photos.size" }
                }
            },
            {
                $group: {
                    _id: null,
                    grandTotal: { $sum: "$totalSize" }
                }
            }
        ]);

        const totalUsageBytes = result.length > 0 ? result[0].grandTotal : 0;

        console.log(`[STORAGE SYNC] Calculated Total Usage: ${(totalUsageBytes / 1024 / 1024).toFixed(2)} MB`);

        // 2. Update Admin User
        // Find the admin user. Ideally, we should pass userId, but system currently assumes single admin/tenant ownership structure for quota.
        const adminUser = await User.findOne({ role: 'admin' });

        if (adminUser) {
            if (adminUser.storageUsage !== totalUsageBytes) {
                console.log(`[STORAGE SYNC] Updating Admin Quota: ${adminUser.storageUsage} -> ${totalUsageBytes}`);
                adminUser.storageUsage = totalUsageBytes;
                await adminUser.save();
                return true; // Updated
            }
        } else {
            console.warn('[STORAGE SYNC] Admin user not found to update quota.');
        }

        return false; // No change needed
    } catch (error) {
        console.error('[STORAGE SYNC] Error:', error);
        throw error;
    }
}
