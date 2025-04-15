import React from "react";

const Card = ({ img, title, number, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4">
      <img src={img} alt="Logo" className="h-12 w-12" />

      <div>
        <p className="text-sm text-gray-500 font-semibold">{title}</p>
        {/* below number can vary based on api */}
        <h1 style={{ color }} className="text-2xl font-semibold">
          {number}
        </h1>
      </div>
    </div>
  );
};

export default Card;
