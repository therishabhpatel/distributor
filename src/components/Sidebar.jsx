import React, { useState } from "react";
import wetaranLogo from "../assets/wetaran-logo.svg";
import dashboardIcon from "../assets/dashboard-icon.svg";
import orderIcon from "../assets/order-icon.svg";
import inventoryIcon from "../assets/inventory-icon.svg";
import retailerIcon from "../assets/retailer-icon.svg";
import salesTeamIcon from "../assets/sales-team-icon.svg";
import deliveryIcon from "../assets/delivery-icon.svg";
import reportIcon from "../assets/report-icon.svg";
import settingIcon from "../assets/setting-icon.svg";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  // Track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState({
    inventory: false,
    retailers: false,
    salesTeam: false,
    deliveryTeam: false,
  });

  // Toggle function for dropdowns
  const toggleDropdown = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="h-screen bg-white shadow-md overflow-auto pb-4 sticky top-0">
      <img
        src={wetaranLogo}
        alt="Wetaran Logo"
        className="max-w-40 mx-auto py-8"
      />

      {/* Menu Links */}
      <div className="flex flex-col">
        {/* Dashboard */}
        <Link
          to="/home/dashboard"
          className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100"
        >
          <div className="w-6 h-6 flex items-center justify-center mr-3">
            <img src={dashboardIcon} alt="Dashboard icon" className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        {/* Order - Active Item */}
        <Link
          to="/home/order"
          className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100"
        >
          <div className="w-6 h-6 flex items-center justify-center mr-3">
            <img src={orderIcon} alt="Order icon" className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Order</span>
        </Link>

        {/* Inventory dropdown */}
        <div>
          <div
            className="flex items-center justify-between py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleDropdown("inventory")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-3">
                <img
                  src={inventoryIcon}
                  alt="Inventory icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-sm font-medium">Inventory</span>
            </div>
            {expandedItems.inventory ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>

          {/* Inventory sub-items */}
          {expandedItems.inventory && (
            <div className="ml-12 flex flex-col">
              <Link
                to="/home/inventoryList"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                List of Inventory
              </Link>
              {/* work is pending on the below link */}
              <Link
                to="/inventory/add"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Add Inventory
              </Link>
              <Link
                to="/home/timeline"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Timeline
              </Link>
            </div>
          )}
        </div>

        {/* Retailers dropdown */}
        <div>
          <div
            className="flex items-center justify-between py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleDropdown("retailers")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-3">
                <img
                  src={retailerIcon}
                  alt="Reatiler icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-sm font-medium">Retailers</span>
            </div>
            {expandedItems.retailers ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>

          {/* Retailers sub-items */}
          {expandedItems.retailers && (
            <div className="ml-12 flex flex-col">
              <Link
                to="/home/retailersList"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                List of Retailers
              </Link>
              <Link
                to="/retailers/add"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Add Retailer
              </Link>
            </div>
          )}
        </div>

        {/* Sales Team dropdown */}
        <div>
          <div
            className="flex items-center justify-between py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleDropdown("salesTeam")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-3">
                <img
                  src={salesTeamIcon}
                  alt="Sales Team icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-sm font-medium">Sales Team</span>
            </div>
            {expandedItems.salesTeam ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>

          {/* Sales Team sub-items */}
          {expandedItems.salesTeam && (
            <div className="ml-12 flex flex-col">
              <Link
                to="/sales-team/zsm-asm"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ZSM & ASM
              </Link>
              <Link
                to="/sales-team/officers"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Sales Officers
              </Link>
              <Link
                to="/sales-team/add"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Add Member
              </Link>
              <Link
                to="/sales-team/attendance"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Attendance
              </Link>
              <Link
                to="/sales-team/performance"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Performance
              </Link>
            </div>
          )}
        </div>

        {/* Delivery Team dropdown */}
        <div>
          <div
            className="flex items-center justify-between py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleDropdown("deliveryTeam")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-3">
                <img
                  src={deliveryIcon}
                  alt="Delivery icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-sm font-medium">Delivery Team</span>
            </div>
            {expandedItems.deliveryTeam ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>

          {/* Delivery Team sub-items */}
          {expandedItems.deliveryTeam && (
            <div className="ml-12 flex flex-col">
              <Link
                to="/delivery-team/pending"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Pending Delivery
              </Link>
              <Link
                to="/delivery-team/complete"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Complete Delivery
              </Link>
              <Link
                to="/delivery-team/route"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Route
              </Link>
              <Link
                to="/delivery-team/add"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Add Driver
              </Link>
              <Link
                to="/delivery-team/attendance"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Attendance
              </Link>
              <Link
                to="/delivery-team/performance"
                className="py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Performance
              </Link>
            </div>
          )}
        </div>

        {/* report section */}
        <Link
          to="/dashboard"
          className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100"
        >
          <div className="w-6 h-6 flex items-center justify-center mr-3">
            <img src={reportIcon} alt="Report icon" className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Reports</span>
        </Link>

        {/* setting section */}
        <Link
          to="/dashboard"
          className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100"
        >
          <div className="w-6 h-6 flex items-center justify-center mr-3">
            <img src={settingIcon} alt="Report icon" className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Setting</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
