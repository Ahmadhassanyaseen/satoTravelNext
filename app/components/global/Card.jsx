import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLocationDot, 
  faSearch, 
  faCalendarDays, 
  faUsers,
  faCar 
} from "@fortawesome/free-solid-svg-icons";

const Card = ({
  _id,
  image,
  locationFrom,
  locationTo,
  days,
  maxPeople,
  title,
  subtitle,
  description,
  price,
  vehicleType,
  status
}) => {
  
  let rating = Math.floor(Math.random() * 2) + 4;
 
  return (
    <Link href={`/service/${_id}`} className="block">
      <div className="p-4 hover:scale-105 transition-all duration-300">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-60">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span className="absolute top-0 left-0 bg-black bg-opacity-40 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <FontAwesomeIcon icon={faSearch} className="text-white text-2xl" />
            </span>

            <div className="absolute bottom-0 left-0 flex text-sm text-white w-full">
              <p className="flex-1 p-2 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} /> {locationFrom} → {locationTo}
              </p>
              <p className="flex-1 p-2 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} /> {days} days
              </p>
              <p className="flex-1 p-2 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faUsers} /> {maxPeople}
              </p>
            </div>
          </div>
          <div className="p-4 text-left">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-black">{title}</div>
              <div className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon icon={faCar} />
                <span className="text-sm">{vehicleType}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">{subtitle}</div>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400 text-sm">
                {"★".repeat(rating)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-3 line-clamp-6">
              {description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button className="btn-shine">
                <span>Get Quote</span>
              </button>
              <span className={`px-2 py-1 rounded text-sm ${
                status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : status === 'booked'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status}
              </span>
            </div>
          </div>
          <div className="absolute top-4 left-[40%] bg-black bg-opacity-50 text-white text-sm p-3 rounded">
            $ {price}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
