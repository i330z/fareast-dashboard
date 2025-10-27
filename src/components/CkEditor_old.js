"use client";
import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapter from "@/utils/customUploadAdapter";
import { useFileUpload } from "@/hooks/useFileUpload";



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
                toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
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
