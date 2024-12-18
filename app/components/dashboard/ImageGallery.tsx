'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

interface ImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  mainImage: string;
  onMainImageChange: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagesChange,
  mainImage,
  onMainImageChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.url;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImageUrls]);
      
      // Set first uploaded image as main image if there isn't one
      if (!mainImage && newImageUrls.length > 0) {
        onMainImageChange(newImageUrls[0]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // If main image was deleted, set new main image
    if (images[index] === mainImage) {
      onMainImageChange(newImages[0] || '');
    }
  };

  const handleSetMainImage = (image: string) => {
    onMainImageChange(image);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <FontAwesomeIcon icon={faPlus} className="text-gray-400 text-2xl" />
        </label>
        <div className="flex-1 overflow-x-auto">
          <div className="flex space-x-4 p-2">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`relative group ${
                  image === mainImage ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="w-28 h-28 relative">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1 bg-red-500 text-white rounded-full mr-2"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSetMainImage(image)}
                      className="p-1 bg-blue-500 text-white rounded-full"
                    >
                      Set Main
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
