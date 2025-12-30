import { UPLOAD_URL } from "$lib/js/api-urls.js";

/**
 * Uploads an image file to the server.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - A promise that resolves to the image URL.
 */
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image-file", file);

    const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
}
