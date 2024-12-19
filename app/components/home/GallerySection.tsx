'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { GalleryItem } from '@/types/gallery';

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Gallery</h2>
          <p className="text-gray-600">Explore our amazing collection of moments and memories</p>
        </div>
        
        <div className="gallery-slider">
          <Slider {...settings}>
            {images.map((image) => (
              <div key={image._id} className="px-2">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={image.image}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx global>{`
        .gallery-slider .slick-prev,
        .gallery-slider .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }
        .gallery-slider .slick-prev {
          left: -40px;
        }
        .gallery-slider .slick-next {
          right: -40px;
        }
        .gallery-slider .slick-prev:before,
        .gallery-slider .slick-next:before {
          font-size: 40px;
          color: #000;
        }
        .gallery-slider .slick-dots li button:before {
          font-size: 12px;
          color: #000;
        }
        .gallery-slider .slick-dots li.slick-active button:before {
          color: #000;
        }
        .gallery-slider .slick-list {
          margin: 0 -8px;
        }
        .gallery-slider .slick-slide > div {
          padding: 0 8px;
        }
      `}</style>
    </section>
  );
}
