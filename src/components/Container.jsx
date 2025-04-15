import React from "react";

const Container = ({ children, className }) => {
  return (
    <div
      className={`bg-white rounded-md shadow-sm p-3 h-full ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default Container;
