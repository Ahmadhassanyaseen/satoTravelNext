"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronLeft,
  faChevronRight,
  
} from "@fortawesome/free-solid-svg-icons";
import AvailabilityForm from "./AvailabilityForm";

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Function to animate elements
  const animateElements = () => {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        ".slick-slide.slick-current .fade-left"
      );
      elements.forEach((element, index) => {
        const delay = index * 200;
        element.style.transitionDelay = `${delay}ms`;
        element.classList.add("visible");
      });
    }, 100); // Small delay to ensure DOM is ready
  };

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch('/api/sliders/active');
        if (!response.ok) throw new Error('Failed to fetch sliders');
        const data = await response.json();
        setSliders(data);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Separate useEffect for animations after content is loaded
  useEffect(() => {
    if (!isLoading && sliders.length > 0 && !initialized) {
      animateElements();
      setInitialized(true);
    }
  }, [isLoading, sliders, initialized]);

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    dots: false,
    fade: true,
    cssEase: "ease-in-out",
    prevArrow: (
      <button
        type="button"
        className="slick-prev text-2xl text-gray-800"
        aria-label="Previous"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-white" />
      </button>
    ),
    nextArrow: (
      <button
        type="button"
        className="slick-next text-2xl text-gray-800"
        aria-label="Next"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-white" />
      </button>
    ),
    beforeChange: () => {
      const elements = document.querySelectorAll(".slick-slide .fade-left");
      elements.forEach((element) => {
        element.classList.remove("visible");
        element.style.transitionDelay = "0ms";
      });
    },
    afterChange: () => {
      animateElements();
    },
    onInit: () => {
      // Ensure first slide animations run after slider initialization
      if (!initialized) {
        animateElements();
        setInitialized(true);
      }
    }
  };

  if (isLoading) {
    return <div className="h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <section id="home" className="relative min-h-screen">
      <Slider {...settings} className="slick-slider text-white text-left">
        {sliders.map((slide) => (
          <div key={slide._id} className="relative h-screen">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start p-20">
              <div className="text-left">
                <p className="mb-4 text-2xl fade-left opacity-0 transition-all duration-500">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-6xl font-bold fade-left opacity-0 transition-all duration-500 delay-200">
                  {slide.title}
                </h1>
                <p className="fade-left opacity-0 transition-all duration-500 delay-400 mt-4 text-xl w-2/3">
                  {slide.description}
                </p>
                {slide.link && (
                  <a 
                    href={slide.link} 
                    className="btn mt-6 fade-left opacity-0 transition-all duration-500 delay-600"
                  >
                    {slide.linkText || 'Learn More'} <span className="ml-1">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>

     <AvailabilityForm />
    </section>
  );
};

export default HeroSlider;
