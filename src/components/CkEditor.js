"use client";
import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapter from "@/utils/customUploadAdapter";
import { useFileUpload } from "@/hooks/useFileUpload";

// import { ImageResize } from 'ckeditor5'

const TextEditor = ({ value, onChange }) => {
  const { uploadFile } = useFileUpload();

  // Function to plug in our custom upload adapter
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, uploadFile);
    };
  }

  return (
    <div className="w-full">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          extraPlugins: [CustomUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "insertTable",
            "uploadImage",
            "undo",
            "redo",
          ],


          image: {
            resizeOptions: [
              {
                name: 'resizeImage:original',
                label: 'Original',
                value: null
              },
              {
                name: 'resizeImage:50',
                label: '50%',
                value: '50'
              },
              {
                name: 'resizeImage:75',
                label: '75%',
                value: '75'
              }
            ],
            toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side", 'resizeImage:50',
              'resizeImage:75',
              'resizeImage:original',
              'toggleImageCaption',
              '|',
              'imageStyle:inline',
              'imageStyle:wrapText',
              'imageStyle:breakText',
              '|',
              'resizeImage'
            ],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>

    // <div>
    //     <CKEditor
    //         editor={CustomEditor}
    //         data={value}
    //         config={{
    //             extraPlugins: [CustomUploadAdapterPlugin],
    //         }}
    //         onChange={(event, editor) => {
    //             onChange(editor.getData());
    //         }}
    //     />

    // </div>
  );
};

export default TextEditor;
