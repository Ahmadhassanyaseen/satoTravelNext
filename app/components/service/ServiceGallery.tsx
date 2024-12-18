'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExpand } from '@fortawesome/free-solid-svg-icons';

interface ServiceGalleryProps {
  images: string[];
  mainImage: string;
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images, mainImage }) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const allImages = [mainImage, ...images.filter(img => img !== mainImage)];

  const handleThumbnailClick = (image: string) => {
    setCurrentImage(image);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    setModalImageIndex(prevIndex => {
      if (direction === 'prev') {
        return prevIndex === 0 ? allImages.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === allImages.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-[500px] mb-4 group cursor-pointer"
           onClick={() => openModal(allImages.indexOf(currentImage))}>
        <Image
          src={currentImage}
          alt="Service"
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
        <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <FontAwesomeIcon icon={faExpand} className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {allImages.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-square cursor-pointer ${
              currentImage === image ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleThumbnailClick(image)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
             onClick={closeModal}>
          <div className="relative w-full h-full flex items-center justify-center"
               onClick={e => e.stopPropagation()}>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => navigateModal('prev')}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
            </button>
            
            <div className="relative w-[90vw] h-[80vh]">
              <Image
                src={allImages[modalImageIndex]}
                alt="Service"
                fill
                className="object-contain"
              />
            </div>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => navigateModal('next')}
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceGallery;
