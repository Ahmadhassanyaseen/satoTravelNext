import React from 'react'

const BookingForm = () => {
  return (
     <section className="bg-[#F9F9F7] py-16 py-[4rem]" id="booking">
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* <!-- Left Content --> */}
        <div>
          <h2
            className="text-[4rem] md:text-[5rem] font-bold text-gray-200 mb-[-1.5rem] uppercase relative"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Booking
          </h2>
          <h3
            className="text-3xl md:text-5xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Online Booking
          </h3>
          <p
            data-aos="fade-up"
            data-aos-duration="3000"
            className="text-gray-500 text-sm md:text-base leading-relaxed mb-6"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            maxime ullam esse fuga blanditiis accusantium pariatur quis
            sapiente, veniam doloribus praesentium? Repudiandae iste voluptatem
            fugiat doloribus quasi quo iure officia.
          </p>
          <p
            data-aos="fade-up"
            data-aos-duration="3000"
            className="text-gray-500 text-sm md:text-base leading-relaxed mb-6"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            maxime ullam esse fuga blanditiis accusantium pariatur quis
            sapiente, veniam doloribus praesentium? Repudiandae iste voluptatem
            fugiat doloribus quasi quo iure officia.
          </p>
          <button
            className="btn-shine text-black"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            <span className="text-black">Get Quote</span>
          </button>
        </div>

        {/* <!-- Right Content: Booking Form --> */}
        <div
          className="bg-white text-gray-800 p-8 rounded-lg shadow-lg"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          <h3
            className="text-xl md:text-2xl font-bold mb-4"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            Book A Tour Deals
          </h3>
          <p
            data-aos="fade-up"
            data-aos-duration="3000"
            className="text-sm md:text-base text-gray-500 mb-6"
          >
            Get <span className="text-black font-bold">50% Off</span> on your first
            adventure trip with Travela. Get more deal offers here.
          </p>
          <form
            action="#"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 bookingForm"
          >
            {/* <!-- Input Fields --> */}

            <div className="inputGroup col-span-2 sm:col-span-1" data-aos="fade-up" data-aos-duration="3000">
              <input type="text" required="" autocomplete="off" />
              <label for="name">Name</label>
            </div>
            <div className="inputGroup col-span-2 sm:col-span-1" data-aos="fade-up" data-aos-duration="3000">
              <input type="email" required="" autocomplete="off" />
              <label for="email">Email</label>
            </div>
            <div className="inputGroup col-span-2 sm:col-span-1" data-aos="fade-up" data-aos-duration="3000">
              <input type="tel" required="" autocomplete="off" />
              <label for="phone">Phone</label>
            </div>

            <select
              data-aos="fade-up"
              data-aos-duration="3000"
              className="col-span-2 sm:col-span-1 border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>Destination 1</option>
              <option>Destination 2</option>
              <option>Destination 3</option>
            </select>

            <select
              data-aos="fade-up"
              data-aos-duration="3000"
              className="col-span-2 sm:col-span-1 border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>Persons 1</option>
              <option>Persons 2</option>
              <option>Persons 3</option>
            </select>
            <select
              data-aos="fade-up"
              data-aos-duration="3000"
              className="col-span-2 sm:col-span-1 border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>Kids</option>
              <option>Adults</option>
              <option>Family</option>
            </select>
            <div
              className="inputGroup col-span-2"
              data-aos="fade-up"
              data-aos-duration="3000"
            >
              <input type="text" required="" autocomplete="off" className="h-20" />
              <label for="phone">Message</label>
            </div>

            {/* <!-- Submit Button --> */}
            <button
              type="submit"
              className="btn-shine"
              data-aos="fade-up"
              data-aos-duration="3000"
            >
              <span> Book Now </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default BookingForm
