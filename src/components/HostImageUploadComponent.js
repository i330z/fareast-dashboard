"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "../hooks/useFileUpload";

export default function HostImageUploadComponent({ initialImage = null, onUploadSuccess }) {
    const { uploadFile } = useFileUpload();
    const [item, setItem] = useState(() => {
        if (!initialImage) return null;
        return { id: initialImage.id ?? Date.now(), status: "success", progress: 100, url: initialImage.url, name: initialImage.name ?? "" };
    });

    // track local preview (object URL) so we only revoke those
    const localPreviewRef = useRef(null);

    // update internal state when parent changes initialImage (important for edit flow)
    useEffect(() => {
        // cleanup any local preview when switching to a remote/initial image
        if (localPreviewRef.current) {
            URL.revokeObjectURL(localPreviewRef.current);
            localPreviewRef.current = null;
        }

        if (initialImage) {
            setItem({
                id: initialImage.id ?? Date.now(),
                status: "success",
                progress: 100,
                url: initialImage.url,
                name: initialImage.name ?? ""
            });
        } else {
            setItem(null);
        }
    }, [initialImage]);

    useEffect(() => {
        return () => {
            if (localPreviewRef.current) {
                URL.revokeObjectURL(localPreviewRef.current);
                localPreviewRef.current = null;
            }
        };
    }, []);

    const handleFile = async (file) => {
        if (!file) return;

        // revoke previous preview if it was local
        if (localPreviewRef.current) {
            URL.revokeObjectURL(localPreviewRef.current);
            localPreviewRef.current = null;
        }

        const preview = URL.createObjectURL(file);
        localPreviewRef.current = preview;

        const tmpId = Date.now();
        setItem({ id: tmpId, status: "uploading", progress: 5, url: preview, name: file.name });

        try {
            const url = await uploadFile(file); // should return URL string
            const id = Date.now() + Math.random();
            setItem({ id, status: "success", progress: 100, url, name: file.name });

            if (onUploadSuccess) onUploadSuccess({ id, url, name: file.name });

            // cleanup local preview (we now show remote url)
            if (localPreviewRef.current) {
                URL.revokeObjectURL(localPreviewRef.current);
                localPreviewRef.current = null;
            }
        } catch (err) {
            setItem(prev => ({ ...prev, status: "error", progress: 0, error: err?.message || String(err) }));
        }
    };

    const handleInputChange = (e) => {
        const f = e.target.files?.[0];
        handleFile(f);
        if (e.target) e.target.value = "";
    };

    const removeImage = () => {
        if (localPreviewRef.current) {
            URL.revokeObjectURL(localPreviewRef.current);
            localPreviewRef.current = null;
        }
        setItem(null);
        if (onUploadSuccess) onUploadSuccess(null);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                    <Upload className="w-4 h-4" /> Host Image
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="w-full h-40 bg-muted rounded overflow-hidden flex items-center justify-center">
                    {item?.url ? (
                        <img src={item.url} alt={item.name || "host"} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                            <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                            <div>No image</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="host-image-uploader" />
                    <label htmlFor="host-image-uploader" className="m-0">
                        <Button type="button" onClick={() => document.getElementById("host-image-uploader")?.click()} size="sm">
                            {item && item.status === "uploading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            {item ? (item.status === "success" ? "Replace" : "Upload") : "Upload"}
                        </Button>
                    </label>

                    {item && (
                        <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}

                    {item?.status === "success" && (
                        <div className="ml-auto text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Uploaded
                        </div>
                    )}
                    {item?.status === "error" && (
                        <div className="ml-auto text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> Error
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}