export const uploadFile = async (file, folderName) => {
    console.log('UPLOAD FUNTION')
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folderName.toLowerCase().replace(/\s+/g, '-'));
        const response = await fetch('https://adhri-project.el.r.appspot.com/upload', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) throw new Error('Failed to upload file');

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading file', error);
        throw error;
    }
}