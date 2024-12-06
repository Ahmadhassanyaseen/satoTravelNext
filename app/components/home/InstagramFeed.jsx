import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const InstagramFeed = () => {
  return (
    <section className="text-left content-center container mx-auto min-h-[70vh] max-w-[90vw] relative py-[4rem]">
      <div>
        <h1
          className="text-[3.4rem] md:text-[5rem] font-bold text-gray-200 mb-[-1.5rem] uppercase relative"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          Instagram
        </h1>
        <div className="columns-2 md:columns-6 gap-5 h-[150px]">
          <div
            data-aos="fade-up"
            data-aos-duration="2000"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
              <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="2200"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
            <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="2400"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
            <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="2600"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
            <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="2800"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
            <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="3000"
            className="w-full h-full mb-4 relative flex justify-center items-center socialImageBox ease-in-out duration-300"
          >
            <Image
              src="/assets/images/1.jpg"
              alt="Instagram post"
              fill
              className="object-cover"
            />
            <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 opacity-0 ease-in-out duration-300"></span>
            <FontAwesomeIcon icon={faInstagram} className="absolute text-3xl text-white opacity-0 ease-in-out duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed
