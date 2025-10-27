import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadFile } from '../utils/handleImageUpload';

export default function CustomEditor({ onDataChange, projectName, fetchedContent = '' }) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (editorInstance && fetchedContent) {
      editorInstance.setData(fetchedContent);
    }
  }, [fetchedContent, editorInstance]);

  // Custom upload adapter class
  class MyCustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    async upload() {
      try {
        const file = await this.loader.file;
        const url = await uploadFile(file, 'blog-images');
        return {
          default: url,
        };
      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    }

    abort() {
      // Abort upload implementation
    }
  }

  // Upload adapter plugin
  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyCustomUploadAdapter(loader);
    };
  }

  const editorConfig = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'blockQuote',
      '|',
      'insertTable',
      'uploadImage',
      'undo',
      'redo',
    ],
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side',
        'toggleImageCaption',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };

  return (
    <div className="w-full">
      {isLayoutReady && (
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={fetchedContent}
          onReady={(editor) => {
            setEditorInstance(editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onDataChange(data);
          }}
        />
      )}
    </div>
  );
}
