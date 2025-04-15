import React from "react";
import Card from "./Card";
import avgOrderValue from "../assets/avg-order-value.svg";
import stockValue from "../assets/stock-value.svg";
import totalRetailors from "../assets/total-retailors.svg";
import orderProcessed from "../assets/order-processed.svg";

const HeaderDataCards = () => {
  return (
    <div className="py-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        img={avgOrderValue}
        title="Average Order Value"
        number="1,54,212"
        color="#003CBE"
      />
      <Card img={stockValue} title="Stock Value" number="500" color="#5E51A3" />
      <Card
        img={totalRetailors}
        title="Total Retailors"
        number="1500"
        color="#51A44B"
      />
      <Card
        img={orderProcessed}
        title="Order Processed"
        number="4,561"
        color="#003CBE"
      />
    </div>
  );
};

export default HeaderDataCards;

// the number props can be changed based on the api data