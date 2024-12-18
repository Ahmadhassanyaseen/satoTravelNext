import React from 'react'

const VideoCTA = () => {
  return (
    <section className="min-h-[90vh] relative text-center content-center">
      <video
        src="assets/images/travel.mp4"
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        loop
        muted
      ></video>
      <span className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></span>
      <div className="relative z-10 text-white top-[40px]">
        <h1
          className="text-[3rem] font-bold"
          data-aos="fade-up"
          data-aos-duration="2000"
        >
          Start The Journey Now
        </h1>
        <p className="text-[2rem]" data-aos="fade-up" data-aos-duration="2500">
          Take only memories, leave only footprints
        </p>
        <button
          data-aos="fade-up"
          data-aos-duration="3000"
          className="border hover:bg-white hover:text-black ease-in-out duration-300 mt-5 text-white py-2 px-4 rounded"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default VideoCTA
