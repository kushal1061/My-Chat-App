import React from "react";
import { X } from "lucide-react";

/**
 * Full-screen image lightbox overlay.
 * @param {{ src: string, onClose: () => void }}
 */
export default function ImageLightbox({ src, onClose }) {
    if (!src) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
            onClick={onClose}
        >
            <div className="relative max-w-full max-h-full">
                <img
                    src={src}
                    alt="Zoomed"
                    className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
}
