"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import BaseImage from "@/components/ui/BaseImage";
import BaseButton from "@/components/ui/BaseButton";
import Alert from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

/**
 * ProductTemplateImageEditor Component
 * Allows users to upload and edit images on product templates
 *
 * @param {Object} props
 * @param {Object} props.templateImage - Template image object {id, url, alt}
 * @param {string} props.uploadedImage - Uploaded image URL (data URL or blob URL)
 * @param {number} props.imageSize - Image size percentage (50-200)
 * @param {Object} props.imagePosition - Image position {x, y} in percentage
 * @param {string} props.view - Current view: "front" or "behind"
 * @param {Function} props.onImageUpload - Callback when image is uploaded
 * @param {Function} props.onImageRemove - Callback when image is removed
 * @param {Function} props.onImageSizeChange - Callback when image size changes
 * @param {Function} props.onImagePositionChange - Callback when image position changes
 * @param {string} props.className - Additional CSS classes
 */
export default function ProductTemplateImageEditor({
    templateImage,
    uploadedImage,
    imageSize = 100,
    imagePosition = { x: 50, y: 50 },
    view,
    onImageUpload,
    onImageRemove,
    onImageSizeChange,
    onImagePositionChange,
    className
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const t = useTranslations();

    if (!templateImage) return null;

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            if (onImageUpload) {
                onImageUpload(file, view);
            }
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            if (onImageUpload) {
                onImageUpload(file, view);
            }
        }
    };

    const handleMouseDown = (e) => {
        if (!uploadedImage) return;
        e.preventDefault();
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            startPosition: { ...imagePosition }
        });
    };

    const handleMouseMove = (e) => {
        if (!dragStart || !uploadedImage) return;
        e.preventDefault();
        e.stopPropagation();

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // Calculate new position (convert pixels to percentage)
        const container = e.currentTarget.closest(".template-image-container");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const newX = Math.max(0, Math.min(100, dragStart.startPosition.x + (deltaX / rect.width) * 100));
        const newY = Math.max(0, Math.min(100, dragStart.startPosition.y + (deltaY / rect.height) * 100));

        if (onImagePositionChange) {
            onImagePositionChange(view, { x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setDragStart(null);
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        if (onImageSizeChange) {
            onImageSizeChange(view, newSize);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Instructions */}
            {!uploadedImage && (
                <Alert variant="info" size="md" dir="rtl">
                    <div>
                        <p className="font-semibold mb-1">
                            {t("designStudio.uploadYourDesign")}
                        </p>
                        <p className="text-xs">
                            {t("designStudio.uploadInstructions")}
                        </p>
                    </div>
                </Alert>
            )}

            {/* Template Image with Overlay */}
            <div
                className="template-image-container relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square group"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Base Template Image */}
                <div className="absolute inset-0">
                    <BaseImage
                        src={templateImage.url}
                        alt={templateImage.alt || `${view} template`}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Uploaded Image Overlay */}
                {uploadedImage && (
                    <div
                        className="absolute cursor-move z-10"
                        style={{
                            left: `${imagePosition.x}%`,
                            top: `${imagePosition.y}%`,
                            transform: "translate(-50%, -50%)",
                            width: `${imageSize}%`,
                            height: `${imageSize}%`,
                            maxWidth: "100%",
                            maxHeight: "100%"
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="relative w-full h-full border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg bg-white/50">
                            <BaseImage
                                src={uploadedImage}
                                alt="Uploaded design"
                                fill
                                className="object-contain"
                            />
                            {/* Remove button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageRemove?.(view);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                                aria-label={t("designStudio.removeImage")}
                            >
                                <i className="ri-close-line text-sm"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Drop Zone Overlay */}
                {!uploadedImage && (
                    <>
                        <div
                            className={cn(
                                "absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity z-10",
                                isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                        >
                            <div className="text-center text-white p-6">
                                <i className="ri-upload-cloud-2-line text-4xl mb-2"></i>
                                <p className="text-sm font-medium">Drop image here</p>
                            </div>
                        </div>

                        {/* Upload Button - Always Visible */}
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                            <BaseButton
                                variant="primary"
                                size="lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="pointer-events-auto shadow-xl"
                            >
                                <i className="ri-upload-cloud-2-line mr-2 text-xl"></i>
                                {t("designStudio.uploadDesign")}
                            </BaseButton>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            aria-label="Upload image"
                        />

                        {/* Drag & Drop Overlay */}
                        <div
                            className="absolute inset-0 z-0"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </>
                )}
            </div>

            {/* Image Controls */}
            {uploadedImage && (
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("designStudio.imageSize", { size: imageSize })}
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={imageSize}
                            onChange={handleSizeChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>20%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {t("designStudio.dragToReposition")}
                    </p>
                </div>
            )}
        </div>
    );
}

