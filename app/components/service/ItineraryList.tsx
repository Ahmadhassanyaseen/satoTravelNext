import React from 'react';

interface ItineraryListProps {
  itinerary: string;
}

const ItineraryList: React.FC<ItineraryListProps> = ({ itinerary }) => {
  if (!itinerary) return null;

  // Split the itinerary string into items
  const items = itinerary.split(/(?=\d+\.)/g).filter(item => item.trim());

  return (
    <div className=" grid grid-cols-2 gap-3 w-full">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4 ">
          <div className="bg-blue-50 p-4 rounded-lg w-full">
            <p className="text-gray-700">{item.trim()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryList;
