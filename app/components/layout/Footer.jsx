'use client'
import { faFacebook, faInstagram, faTiktok, faViber, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="px-4 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[90vw] mx-auto">
        {/* <!-- Section 1: About --> */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-4"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            {settings?.websiteTitle || 'Tour & Travel'}
          </h3>
          <p
            className="text-sm leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            {settings?.description || 'Wanderer is equipped with everything you need to plan an unforgettable journey. Start exploring today.'}
          </p>
          <h4
            className="mt-6 text-sm font-semibold text-white"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Get Social
          </h4>
          <div className="flex space-x-4 mt-2">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="Btn relative"
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <span className="svgContainer relative z-10 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="text-white text-2xl"
                  />
                </span>
                <span className="BG absolute inset-0" style={{
                  background: 'linear-gradient(45deg,#1877f2 0%,#165cd8 50%,#1548b6 100%)'
                }}></span>
              </a>
            )}

            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="Btn"
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <span className="svgContainer">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-white text-2xl"
                  />
                </span>
                <span className="BG" style={{
                  background: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
                }}></span>
              </a>
            )}
             <a href="https://www.tiktok.com/@sato_japan_tours?_t=8sLAr1ZXknf&_r=1" target="_blank" rel="noopener noreferrer"
                className="Btn relative"
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <span className="svgContainer relative z-10 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faTiktok}
                    className="text-white text-2xl"
                  />
                </span>
                <span className="BG absolute inset-0" style={{
  background: 'linear-gradient(45deg, #ff0050 0%, #7f00ff 50%, #000000 100%)'
}}></span>

              </a>

            {settings?.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="Btn relative"
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <span className="svgContainer relative z-10 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faYoutube}
                    className="text-white text-2xl"
                  />
                </span>
                <span className="BG absolute inset-0" style={{
                  background: 'linear-gradient(45deg,#ff0000 0%,#cc0000 50%,#990000 100%)'
                }}></span>
              </a>
            )}
          </div>
        </div>

        {/* <!-- Section 2: Contact --> */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-4"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li
              data-aos="fade-up"
              data-aos-duration="3000"
              
            >
              <a href="https://www.google.com/maps/place/Tochigi+Prefecture+Oyama+city+Yokokura+-+Shinden+114-42/@36.6558411,139.5627065,17z/data=!3m1!4b1!4m5!3m4!1s0x6018f7e2a2b3b6d1:0x1d4e2e4b3e0b4c9!8m2!3d36.6558411!4d139.5627065" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-white" />
              {settings?.address || 'Tochigi Prefecture Oyama city Yokokura- Shinden 114-42'}
              </a>
            </li>
            <li
              data-aos="fade-up"
              data-aos-duration="3000"
              
            >
              <a href="tel:+819018550039" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-white" />
              {settings?.phone || '+819018550039'}
              </a>
            </li>
            <li
              data-aos="fade-up"
              data-aos-duration="3000"
             
            >
              <a href="https://wa.me/819018550039" target="_blank" rel="noopener noreferrer"  className="flex items-center gap-2">
              <FontAwesomeIcon icon={faViber} className="text-white" /> {
                settings?.phone || '+819018550039'
              }              
              </a>
            </li>
            <li
              data-aos="fade-up"
              data-aos-duration="3000"
              
            >
              <a href="mailto:wanderer@travelmail.com" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-white" />
              {settings?.email || 'wanderer@travelmail.com'}
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Section 3: Links --> */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-4"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li data-aos="fade-up" data-aos-duration="3000">
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li data-aos="fade-up" data-aos-duration="3000">
              <a href="#" className="hover:underline">
                Destinations
              </a>
            </li>
            <li data-aos="fade-up" data-aos-duration="3000">
              <a href="#" className="hover:underline">
                Travel Packages
              </a>
            </li>
            <li data-aos="fade-up" data-aos-duration="3000">
              <a href="#" className="hover:underline">
                Booking
              </a>
            </li>
            <li data-aos="fade-up" data-aos-duration="3000">
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Section 4: Newsletter --> */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-4"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Newsletter
          </h3>
          <p
            className="text-sm leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Sign up for our newsletter and stay updated on the latest travel
            deals and destinations.
          </p>
          <div className="mt-4">
            <form
              action="#"
              className="flex items-center border-b border-gray-500"
              data-aos="fade-up"
              data-aos-duration="3000"
            >
              <input
                type="email"
                placeholder="Your Email"
                className="bg-gray-900 text-gray-300 placeholder-gray-400 px-2 py-1 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="text-green-400 px-2 hover:text-white"
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Bottom Section --> */}
      <div className="mt-12 max-w-[90vw] mx-auto border-t border-gray-700 flex items-center justify-between pt-4 text-center text-sm flex-col md:flex-row">
        <p>Terms of Use | Privacy Policy</p>
        <p className="mt-2">© 2024 {settings?.websiteTitle || 'Wanderer'}, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer
