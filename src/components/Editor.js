"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import "quill/dist/quill.snow.css";


export default function SimpleEditor({ onChange, text }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const imageInputRef = useRef(null);
    const lastImageIndexRef = useRef(null); // added to track clicked image index
    const lastImageElementRef = useRef(null); // track actual <img> element
    const deleteBtnRef = useRef(null); // overlay delete button
    const { uploadFile, isLoading } = useFileUpload();

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const selectLocalImage = () => {
                if (imageInputRef.current) {
                    imageInputRef.current.click();
                }
            };

            const handleImageUpload = async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const quill = quillRef.current;
                if (!quill) return;

                const range = quill.getSelection(true);
                const url = await uploadFile(file);

                if (url) {
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1, 0);
                }
                // Reset file input
                if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                }
            };

            // Attach the handleImageUpload to the file input ref
            if (imageInputRef.current) {
                imageInputRef.current.addEventListener('change', handleImageUpload);
            }

            // Custom 'delete' icon for the image resize toolbar (keep if needed)
            const deleteIcon = `<svg viewbox="0 0 18 18">
                <path class="ql-stroke" d="M14.25,2.25H3.75a.75.75,0,0,0-.75.75V5.25h12V3A.75.75,0,0,0,14.25,2.25Z"/>
                <path class="ql-stroke" d="M13.5,6H4.5l.75,9.75A1.5,1.5,0,0,0,6.75,17h4.5a1.5,1.5,0,0,0,1.5-1.25Z"/>
            </svg>`;

            Quill.register("modules/imageResize", ImageResize);

            // register the delete icon (optional)
            try {
                const icons = Quill.import('ui/icons');
                icons['delete'] = deleteIcon;
            } catch (err) {
                // ignore if import fails
            }

            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Write something here...",
                modules: {
                    toolbar: {
                        container: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                        ],
                        handlers: {
                            image: selectLocalImage,
                        },
                    },
                    imageResize: {
                        handleStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"],
                        toolbar: {
                            modules: ["Resize", "DisplaySize", "Toolbar"],
                            actions: ['align', 'delete'],
                            toolbarStyles: {
                                left: 'unset',
                                right: '0'
                            }
                        }
                    },
                },
            });

            // Ensure editor container is positioned so overlay can be placed absolutely
            if (editorRef.current && getComputedStyle(editorRef.current).position === 'static') {
                editorRef.current.style.position = 'relative';
            }

            // Create overlay delete button (one instance)
            const createDeleteButton = () => {
                const btn = document.createElement('button');
                btn.setAttribute('type', 'button');
                btn.className = 'quill-image-delete-btn';
                btn.style.position = 'absolute';
                btn.style.display = 'none';
                btn.style.zIndex = '50';
                btn.style.width = '28px';
                btn.style.height = '28px';
                btn.style.borderRadius = '6px';
                btn.style.border = 'none';
                btn.style.background = 'rgba(0,0,0,0.7)';
                btn.style.color = 'white';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.cursor = 'pointer';
                btn.style.padding = '0';
                btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`;

                // click handler removes the image
                const onBtnClick = (ev) => {
                    ev.stopPropagation();
                    const quill = quillRef.current;
                    const img = lastImageElementRef.current;
                    if (!quill || !img) return;
                    try {
                        const blot = Quill.find(img);
                        const index = quill.getIndex(blot);
                        quill.deleteText(index, 1);
                    } catch (err) {
                        // fallback: remove DOM node
                        img.remove();
                    }
                    hideDeleteButton();
                    if (onChange) onChange(quillRef.current.root.innerHTML);
                };

                btn.addEventListener('click', onBtnClick);
                deleteBtnRef.current = btn;
                editorRef.current.appendChild(btn);
            };

            const positionDeleteButton = (img) => {
                if (!deleteBtnRef.current || !img) return;
                const editorRect = editorRef.current.getBoundingClientRect();
                const imgRect = img.getBoundingClientRect();

                // compute position relative to editor container + scroll offset
                const top = imgRect.top - editorRect.top + editorRef.current.scrollTop + 6;
                const left = imgRect.left - editorRect.left + editorRef.current.scrollLeft + imgRect.width - 34;

                deleteBtnRef.current.style.top = `${top}px`;
                deleteBtnRef.current.style.left = `${left}px`;
                deleteBtnRef.current.style.display = 'flex';
            };

            const hideDeleteButton = () => {
                if (deleteBtnRef.current) {
                    deleteBtnRef.current.style.display = 'none';
                }
                lastImageElementRef.current = null;
                lastImageIndexRef.current = null;
            };

            // track clicks on images to show overlay delete button and record their quill index
            const handleEditorClick = (e) => {
                const quill = quillRef.current;
                if (!quill) return;
                const img = e.target.closest('img');
                const isDeleteBtn = e.target.closest('.quill-image-delete-btn');
                if (isDeleteBtn) return; // button handled separately
                if (img && editorRef.current.contains(img)) {
                    try {
                        const blot = Quill.find(img);
                        const index = quill.getIndex(blot);
                        lastImageIndexRef.current = index;
                        lastImageElementRef.current = img;
                        if (!deleteBtnRef.current) createDeleteButton();
                        positionDeleteButton(img);
                    } catch (err) {
                        lastImageIndexRef.current = null;
                        lastImageElementRef.current = null;
                        hideDeleteButton();
                    }
                } else {
                    // click outside image -> hide button
                    hideDeleteButton();
                }
            };

            // reposition overlay when editor scrolls / window resizes
            const repositionIfNeeded = () => {
                const img = lastImageElementRef.current;
                if (img && deleteBtnRef.current && deleteBtnRef.current.style.display !== 'none') {
                    positionDeleteButton(img);
                }
            };

            // click anywhere inside editor to detect image clicks
            editorRef.current.addEventListener('click', handleEditorClick);
            window.addEventListener('resize', repositionIfNeeded);
            editorRef.current.addEventListener('scroll', repositionIfNeeded);

            quillRef.current.on("text-change", () => {
                if (onChange) onChange(quillRef.current.root.innerHTML);
                // if text changed and an image was removed externally, hide button
                if (lastImageElementRef.current && !document.body.contains(lastImageElementRef.current)) {
                    hideDeleteButton();
                }
            });

            // Cleanup function
            return () => {
                if (imageInputRef.current) {
                    imageInputRef.current.removeEventListener('change', handleImageUpload);
                }
                if (editorRef.current) {
                    editorRef.current.removeEventListener('click', handleEditorClick);
                    editorRef.current.removeEventListener('scroll', repositionIfNeeded);
                }
                window.removeEventListener('resize', repositionIfNeeded);
                if (deleteBtnRef.current) {
                    deleteBtnRef.current.remove();
                    deleteBtnRef.current = null;
                }
            };
        }
    }, [onChange, uploadFile]);

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
            <input
                type="file"
                ref={imageInputRef}
                style={{ display: "none" }}
                accept="image/*"
            />
            <div ref={editorRef} className="h-40 bg-white" style={{ height: "700px" }}></div>
        </div>
    );
}
