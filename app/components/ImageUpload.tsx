'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const ImageUpload = ({
  onImageUpload,
  existingImage = null
}: {
  onImageUpload: (url: string) => void;
  existingImage?: string | null;
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      onImageUpload(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/jpg': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="text-gray-600">Uploading...</div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-600">
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag & drop an image here, or click to select one</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Supported formats: JPG, PNG, WebP
            </div>
          </div>
        )}
      </div>

      {preview && (
        <div className="relative">
          <Image
            src={preview}
            alt="Preview"
            width={192}
            height={192}
            className="mt-4 rounded-lg mx-auto"
            priority
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              onImageUpload('');
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 