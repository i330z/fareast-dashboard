// CustomUploadAdapter.js
export default class CustomUploadAdapter {
  constructor(loader, uploadFile) {
    // The file loader instance to use during the upload
    this.loader = loader;
    this.uploadFile = uploadFile;
  }

  // Starts the upload process
  async upload() {
    const file = await this.loader.file;
    const url = await this.uploadFile(file); // Call your hook’s function
    return { default: url }; // CKEditor expects this format
  }

  // Optional: abort upload (not mandatory but good practice)
  abort() {
    // You could cancel ongoing requests here if needed
  }
}
