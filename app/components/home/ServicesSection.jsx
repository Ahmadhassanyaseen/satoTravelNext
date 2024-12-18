"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "../global/Card";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    AOS.init();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    afterChange: () => {
      AOS.refresh(); // Refresh AOS animations when the slider moves
    },
  };

  useEffect(() => {
    AOS.refresh();
    const fetchServices = async () => {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
      console.log(data);
      console.log("xeno");
    };
    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="min-h-screen text-center content-center max-w-[90vw] mx-auto py-[4rem]"
    >
      <div className="bg-white py-16">
        <div className="text-center max-w-3xl mx-auto px-4 relative">
          <h1
            className="text-[4rem] md:text-[5rem] leading-[4rem] font-bold text-gray-100 mb-[-1.5rem] uppercase relative"
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
            Explore the world’s most breathtaking locations. Whether it’s
            relaxing on a pristine beach, hiking through lush mountains, or
            experiencing vibrant cityscapes, we have something for every
            traveler.
          </p>
        </div>

       
      </div>

   
      <Slider {...settings} className="slick-slider-serve">
        {services.map((data, index) => (
          <div key={index}>
            <Card {...data} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ServicesSection;
