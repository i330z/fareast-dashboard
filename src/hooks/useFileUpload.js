import { useState, useCallback } from 'react';

const UPLOAD_API_URL = 'https://adhri-project.el.r.appspot.com/upload';

/**
 * A custom React hook for handling file uploads.
 * It manages the loading, error, and data states of the upload process.
 *
 * @returns {{
 *   uploadFile: (file: File, folder?: string) => Promise<string | undefined>;
 *   isLoading: boolean;
 *   error: Error | null;
 *   data: { url: string } | null;
 * }} An object containing the upload function and state variables.
 */
export const useFileUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const uploadFile = useCallback(async (file, folder = 'travel-site') => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            setData(responseData);
            return responseData.url;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, []); // The function is memoized and won't change on re-renders.

    return { uploadFile, isLoading, error, data };
};