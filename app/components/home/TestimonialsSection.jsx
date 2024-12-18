"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data = await response.json();
        // Filter only active testimonials
        setTestimonials(data.filter(t => t.isActive));
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,

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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={index < rating ? faStarSolid : faStarRegular}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading testimonials...</div>;
  }

  return (
    <section className="text-center content-center container mx-auto py-16" id="reviews">
      <div className="bg-white py-16">
        <div className="text-center max-w-3xl mx-auto px-4 relative">
          <h1
            className="text-[4rem] md:text-[5rem] leading-[4rem] font-bold text-gray-100 mb-[-1.5rem] uppercase relative"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Reviews
          </h1>
          <h2
            className="text-[40px] font-[700] text-gray-900 mb-4 leading-[2.5rem]"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            What Our Clients Say
          </h2>
          <p
            className="text-gray-600 text-lg leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Read testimonials from our satisfied customers
          </p>
        </div>
      </div>

      <Slider {...settings} className="testimonial-slider px-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
              <p
                className="text-gray-600 flex-grow"
                data-aos="fade-up"
                data-aos-duration="2500"
              >
                {testimonial.description}
              </p>
              <div className="mb-4" data-aos="fade-up" data-aos-duration="2000">
                {renderStars(testimonial.rating)}
              </div>
              <div className="flex items-center justify-center mb-4 w-full">
                <div className="relative h-12 w-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.post}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TestimonialsSection;
