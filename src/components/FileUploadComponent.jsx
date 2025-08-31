"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const FileUploadComponent = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const { uploadFile, isLoading, error, data } = useFileUpload();
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const uploadedUrl = await uploadFile(selectedFile);

        if (uploadedUrl && onUploadSuccess) {
            onUploadSuccess({
                id: Date.now(),
                url: uploadedUrl,
                name: selectedFile.name,
            });
        }


        setSelectedFile(null); if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    useEffect(() => {
        if (data) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [data]);

    return (
        <Card className="w-full mx-auto mt-10 rounded outline-dotted border-0">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    File Uploader
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* File Input */}
                <div className="flex items-center gap-2">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="cursor-pointer"
                    />
                </div>

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                        </span>
                    ) : (
                        "Upload File"
                    )}
                </Button>

                {/* Progress */}
                {isLoading && <Progress value={60} className="h-2" />} {/* replace with real progress if available */}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Error: {error.message}</span>
                    </div>
                )}

                {/* Success Message */}
                {showSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <p className="flex items-center gap-2 text-green-700 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Upload successful!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FileUploadComponent;
