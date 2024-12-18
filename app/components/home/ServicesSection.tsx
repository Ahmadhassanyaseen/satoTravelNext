'use client';

import React, { useEffect, useState } from 'react';
import Card from '../global/Card';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Vehicle } from '@/app/types/vehicle';

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  locationFrom: string;
  locationTo: string;
  days: number;
  price: number;
  maxPeople: number;
  status: string;
  vehicleId: {
    name: string;
    type: string;
    passengerQuantity: number;
    status: string;
  };
}

interface CardProps {
  _id: string;
  title: string;
  description: string;
  image: string;
  locationFrom: string;
  locationTo: string;
  days: number;
  price: number;
  status: string;
  vehicleId: Vehicle;
  maxPeople: number;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: (
      <button className="slick-prev">
        <FontAwesomeIcon icon={faChevronLeft} className="text-2xl text-gray-600" />
      </button>
    ),
    nextArrow: (
      <button className="slick-next">
        <FontAwesomeIcon icon={faChevronRight} className="text-2xl text-gray-600" />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="text-center content-center container mx-auto min-h-[70vh] max-w-[90vw] relative py-[4rem]" id="services">
      <div className="bg-white py-16">
        <div className="text-center max-w-3xl mx-auto px-4 relative">
          <h1
            className="text-[3.4rem] md:text-[5rem] font-bold text-gray-200 mb-[-1.5rem] uppercase relative"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Services
          </h1>
          <h2
            className="text-[40px] font-[700] text-gray-900 mb-4 leading-[2.5rem]"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Book Your Dream Vacation Now
          </h2>
          <p
            className="text-gray-600 text-lg leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Explore our range of travel services
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading services...</div>
      ) : (
        <Slider {...settings} className="service-slider px-4">
          {services.map((service) => (
            <div key={service._id} className="">
              <Card {...service as CardProps  } maxPeople={service.maxPeople} />
            </div>
          ))}
        </Slider>
      )}

      {services.length === 0 && !isLoading && (
        <div className="text-gray-500 mt-8">
          No services available at the moment.
        </div>
      )}
    </section>
  );
};

export default ServicesSection; 