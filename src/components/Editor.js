"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function SimpleEditor({ onChange, text }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Write something here...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                    ],
                },
            });

            // Example: log content changes
            quillRef.current.on("text-change", () => {
                // console.log("Content:", quillRef.current.root.innerHTML);
                if (onChange) onChange(quillRef.current.root.innerHTML);
            });
        }
    }, []);


    useEffect(() => {
        if (quillRef.current && text !== undefined) {
            const editor = quillRef.current;

            // only replace content if it's different from current
            const currentText = editor.root.innerHTML;
            if (currentText !== text) {
                const selection = editor.getSelection();
                editor.clipboard.dangerouslyPasteHTML(text);
                if (selection) {
                    editor.setSelection(selection.index, selection.length);
                }
            }
        }
    }, [text]);




    return (
        <div className="py-2">
            {/* <h2 className="text-lg font-semibold mb-2">Simple Quill Editor</h2> */}
            <div ref={editorRef} className="h-40 bg-white" style={{ height: "700px" }}></div>
        </div>
    );
}
