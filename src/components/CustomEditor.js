import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadFile } from '@/hooks/handleImageUpload';

export default function CustomEditorWrapper({ value, onDataChange, projectName }) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (editorInstance && value) {
      const currentData = editorInstance.getData();
      if (currentData !== value) {
        editorInstance.setData(value);
      }
    }
  }, [value, editorInstance]);

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
    toolbar: {
      items: [
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
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
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
          data={value}
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
