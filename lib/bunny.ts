const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
const ACCESS_KEY = process.env.BUNNY_STORAGE_API_KEY;
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME;

if (!STORAGE_ZONE_NAME || !ACCESS_KEY || !CDN_HOSTNAME) {
    console.warn('BunnyCDN environment variables are missing!');
}

export async function uploadToBunny(file: File | Blob, filename: string, folder: string = ''): Promise<string> {
    // Clean folder path (ensure it ends with / if not empty)
    if (!STORAGE_ZONE_NAME || !ACCESS_KEY || !CDN_HOSTNAME) {
        throw new Error('BunnyCDN connection is not configured. Please check .env.local keys.');
    }
    const path = folder ? `${folder.replace(/\/$/, '')}/` : '';
    const storageUrl = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${path}${filename}`;

    try {
        const arrayBuffer = await file.arrayBuffer();

        const response = await fetch(storageUrl, {
            method: 'PUT',
            headers: {
                'AccessKey': ACCESS_KEY!,
                'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`BunnyCDN Upload Failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Construct the public URL
        // Ensure CDN_HOSTNAME doesn't have a trailing slash
        const cleanHostname = CDN_HOSTNAME!.replace(/\/$/, '');
        return `https://${cleanHostname}/${path}${filename}`;

    } catch (error) {
        console.error('Error uploading to BunnyCDN:', error);
        throw error;
    }
}

export async function deleteFromBunny(filename: string, folder: string = ''): Promise<boolean> {
    const path = folder ? `${folder.replace(/\/$/, '')}/` : '';
    const storageUrl = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${path}${filename}`;

    try {
        const response = await fetch(storageUrl, {
            method: 'DELETE',
            headers: {
                'AccessKey': ACCESS_KEY!,
            },
        });

        if (!response.ok) {
            console.error(`Failed to delete from BunnyCDN: ${response.status}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting from BunnyCDN:', error);
        return false;
    }
}

export async function listBunnyFiles(folder: string = ''): Promise<any[]> {
    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        throw new Error('BunnyCDN configuration is missing');
    }

    const path = folder ? `${folder.replace(/\/$/, '')}/` : '';
    const storageUrl = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${path}`;

    try {
        const response = await fetch(storageUrl, {
            method: 'GET',
            headers: {
                'AccessKey': ACCESS_KEY,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to list files from BunnyCDN: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error listing files from BunnyCDN:', error);
        return [];
    }
}
