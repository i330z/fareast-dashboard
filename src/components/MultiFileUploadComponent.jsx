"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

const MultiFileUploadComponent = ({ onUploadSuccess, onRemove }) => {
    const fileInputRef = useRef(null);
    const previewsRef = useRef(new Set());
    const { uploadFile } = useFileUpload();

    const [items, setItems] = useState([]); // { id, file, status, progress, url, error, preview }
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        return () => {
            // revoke all created previews on unmount
            previewsRef.current.forEach((p) => URL.revokeObjectURL(p));
            previewsRef.current.clear();
        };
    }, []);

    const addFiles = (fileList) => {
        const filesArray = Array.from(fileList || []);
        if (!filesArray.length) return;
        const newItems = filesArray.map((file, idx) => {
            const preview = URL.createObjectURL(file);
            previewsRef.current.add(preview);
            return {
                id: Date.now() + Math.random() + idx,
                file,
                status: "queued",
                progress: 0,
                url: null,
                error: null,
                preview,
            };
        });

        setItems((prev) => {
            const merged = [...prev, ...newItems];
            // start uploading the newly added items
            newItems.forEach(uploadItem);
            return merged;
        });

        // reset input so same files can be selected again
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
    };

    const uploadItem = async (item) => {
        // optimistic update: mark uploading
        setItems((prev) =>
            prev.map((it) => (it.id === item.id ? { ...it, status: "uploading", progress: 5 } : it))
        );

        try {
            // call hook uploadFile; if it supports progress, integrate here
            const url = await uploadFile(item.file);

            setItems((prev) =>
                prev.map((it) =>
                    it.id === item.id
                        ? { ...it, status: "success", progress: 100, url, error: null }
                        : it
                )
            );

            if (onUploadSuccess) {
                onUploadSuccess({ id: item.id, url, name: item.file.name });
            }
        } catch (err) {
            setItems((prev) =>
                prev.map((it) =>
                    it.id === item.id
                        ? { ...it, status: "error", progress: 0, error: err?.message || String(err) }
                        : it
                )
            );
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer?.files) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const removeItem = (id) => {
        setItems((prev) => {
            const toRemove = prev.find((it) => it.id === id);
            if (toRemove?.preview) {
                URL.revokeObjectURL(toRemove.preview);
                previewsRef.current.delete(toRemove.preview);
            }
            const next = prev.filter((it) => it.id !== id);
            // notify parent about removal (if uploaded previously, include url so parent can match)
            if (toRemove && typeof onRemove === "function") {
                try { onRemove({ id: toRemove.id, url: toRemove.url, name: toRemove.file?.name }); } catch (e) { /* ignore */ }
            }
            return next;
        });
    };

    const retryItem = (id) => {
        const item = items.find((it) => it.id === id);
        if (!item) return;
        uploadItem({ ...item, status: "queued", progress: 0 });
    };

    return (
        <Card className="w-full mx-auto mt-10 rounded outline-dotted border-0">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    File Uploader (multi & drag & drop)
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`w-full p-4 rounded border-2 transition-colors ${dragActive ? "border-dashed border-primary bg-primary/5" : "border-dashed border-gray-200"}`}
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Upload className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium">Drag & drop files here, or</p>
                                <p className="text-xs text-muted-foreground">click to select multiple files</p>
                            </div>
                        </div>

                        <div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="cursor-pointer opacity-0 absolute right-0 top-0 w-0 h-0"
                                aria-hidden
                            />
                            <label className="inline-block">
                                <Button type="button" onClick={() => fileInputRef.current?.click()} size="sm">
                                    Choose files
                                </Button>
                            </label>
                        </div>
                    </div>
                </div>

                {/* File list */}
                <div className="space-y-3">
                    {items.length === 0 && <p className="text-sm text-muted-foreground">No files queued.</p>}

                    {items.map((it) => (
                        <div key={it.id} className="p-3 border rounded flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="truncate">
                                        <p className="font-medium truncate">{it.file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(it.file.size / 1024).toFixed(1)} KB</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {it.status === "uploading" && (
                                            <span className="flex items-center gap-2 text-sm text-primary">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading
                                            </span>
                                        )}
                                        {it.status === "success" && (
                                            <span className="flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Done
                                            </span>
                                        )}
                                        {it.status === "error" && (
                                            <span className="flex items-center gap-2 text-sm text-red-600">
                                                <AlertCircle className="w-4 h-4" />
                                                Error
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <Progress value={it.progress} className="h-2" />
                                    {it.error && <p className="text-xs text-red-600 mt-1">{it.error}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {it.status === "error" ? (
                                    <Button variant="ghost" size="sm" onClick={() => retryItem(it.id)}>
                                        Retry
                                    </Button>
                                ) : null}
                                <Button variant="ghost" size="sm" onClick={() => removeItem(it.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Uploaded images grid (shows images after successful upload) */}
                {items.some((it) => it.status === "success") && (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Uploaded Images</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {items
                                .filter((it) => it.status === "success")
                                .map((it) => (
                                    <div key={it.id} className="relative rounded overflow-hidden bg-slate-100">
                                        <img src={it.url || it.preview} alt={it.file.name} className="w-full h-28 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeItem(it.id)}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MultiFileUploadComponent;