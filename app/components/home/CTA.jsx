import React from 'react'
import bgImg from '@/public/assets/images/6.jpg';

const CTA = () => {
  return (
    <section
      className="text-center content-center mx-auto min-h-[90vh] relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImg.src})` }}
    >
      <span className="absolute inset-0 bg-black bg-opacity-40"></span>
      <h2
        className="text-5xl font-bold text-center relative z-10 text-white"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        Discover the beauty of nature
      </h2>
      <p
        data-aos="fade-up"
        data-aos-duration="3000"
        className="text-white text-center relative z-10 max-w-[60%] mx-auto my-3"
      >
        Where every sunrise paints the sky in hues of hope and every whispering
        breeze carries stories of serenity. Immerse yourself in lush forests,
        majestic mountains green gardens, and crystal-clear waters that awaken a
        sense of wonder. Nature’s vibrant colors, soothing sounds, and intricate
        designs remind us of life’s simple, yet profound, treasures. Let the
        stillness of a quiet meadow or the roar of ocean waves inspire you to
        connect, reflect, and embrace the harmony around you.
      </p>
      <button
        data-aos="fade-up"
        data-aos-duration="3000"
        className="border hover:bg-white hover:text-black ease-in-out duration-300 mt-5 text-white py-2 px-4 rounded"
      >
        Get Quote
      </button>
    </section>
  );
}

export default CTA
