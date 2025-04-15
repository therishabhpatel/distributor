import React from "react";
import TotalOrderPlaced from "./TotalOrderPlaced";
import OrderStatus from "./OrderStatus";
import TodaysOrder from "./TodaysOrder";
import TopProducts from "./TopProducts";
import TopRetailers from "./TopRetailers";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[30rem]">
        <div className="col-span-1 lg:col-span-2">
          <TotalOrderPlaced />
        </div>
        <div className="col-span-1">
          <OrderStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[30rem]">
        <TodaysOrder />
        <TopProducts />
        <TopRetailers />
      </div>
    </div>
  );
};

export default Dashboard;
