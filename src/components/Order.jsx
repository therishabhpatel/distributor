import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient"; // update path if needed
import Container from "./Container";
import Table from "./Table";
import eyeIcon from "../assets/eye-icon.svg";
import menuIcon from "../assets/menu-icon.svg";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Order = () => {
  const tabs = [
    { id: "new", name: "New", color: "text-[var(--primary-text)]", border: "border-b-2 border-[var(--primary-text)]" },
    { id: "pending", name: "Pending", color: "text-yellow-500", border: "border-b-2 border-yellow-500" },
    { id: "delivered", name: "Delivered", color: "text-green-500", border: "border-b-2 border-green-500" },
    { id: "cancel", name: "Cancel", color: "text-red-500", border: "border-b-2 border-red-500" },
  ];

  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 15;
  const [visibleProductOrderId, setVisibleProductOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      let query = supabase
        .from("orders")
        .select("customer_name, phone_number, user_name, billing_address, total_amount, order_date, id, products")
        .eq("status", activeTab)
        .order("order_date", { ascending: false });

      if (selectedDate) {
        const startOfDay = format(selectedDate, "yyyy-MM-dd") + "T00:00:00";
        const endOfDay = format(selectedDate, "yyyy-MM-dd") + "T23:59:59";
        query = query.gte("order_date", startOfDay).lte("order_date", endOfDay);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
    setSearchTerm("");
    setCurrentPage(1);
  }, [activeTab, selectedDate]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = orders.filter((order) =>
      order.customer_name?.toLowerCase().includes(lowerSearch) ||
      order.user_name?.toLowerCase().includes(lowerSearch) ||
      order.phone_number?.toLowerCase().includes(lowerSearch) ||
      order.billing_address?.toLowerCase().includes(lowerSearch) ||
      String(order.total_amount).includes(lowerSearch)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatAddress = (address) => {
    const halfway = Math.floor(address.length / 2);
    return (
      <>
        <div>{address.slice(0, halfway)}</div>
        <div>{address.slice(halfway)}</div>
      </>
    );
  };
 
  const handleViewProducts = (orderId) => {
    setVisibleProductOrderId(prev => (prev === orderId ? null : orderId));
  };

  const handleStatusChangeClick = (orderId) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleStatusSelect = async (newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", selectedOrderId);

    if (error) {
      console.error("Error updating order status:", error);
    } else {
      setOrders((prev) => prev.filter((order) => order.id !== selectedOrderId));
      setFilteredOrders((prev) => prev.filter((order) => order.id !== selectedOrderId));
      setSelectedOrderId(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <Container>
      <div>
        <div className="w-full lg:w-[70%] flex gap-50 h-10 pl-4">
          <h1 className="font-bold text-xl">Order</h1>
          <div className="w-full lg:w-[70%] flex gap-16 h-10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Customer Name, Order No., Value , Area"
              className="flex-1 border border-gray-400 rounded-sm outline-none px-2"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Filter by date"
              isClearable
              customInput={
                <div className="px-4 py-1 rounded-sm bg-[var(--main-bg)] text-[var(--primary-text)] font-semibold flex items-center cursor-pointer">
                  <FaCalendarAlt size={18} />
                </div>
              }
            />
          </div>
        </div>

        <div className="flex gap-14 text-xl font-semibold mt-6">
          {tabs.map((tab) => (
            <span
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${tab.color} ${activeTab === tab.id ? `${tab.border}` : ""} px-7 py-2 cursor-pointer`}
            >
              {tab.name}
            </span>
          ))}
        </div>

        <Table>
          <Table.Head>
            <Table.HeaderCell>Customer Name</Table.HeaderCell>
            <Table.HeaderCell>Phone No.</Table.HeaderCell>
            <Table.HeaderCell>Sales Officer</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Order Value</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {currentOrders.map((order, index) => (
              <Table.Row key={index} className="relative">
                <Table.Cell>{order.customer_name}</Table.Cell>
                <Table.Cell>{order.phone_number}</Table.Cell>
                <Table.Cell>{order.user_name}</Table.Cell>
                <Table.Cell>{formatAddress(order.billing_address)}</Table.Cell>
                <Table.Cell>{order.total_amount}</Table.Cell>
                <Table.Cell>
                <div className="relative">
  <img
    src={eyeIcon}
    alt="Eye icon"
    className="min-h-6 min-w-6 cursor-pointer"
    onClick={() => handleViewProducts(order.id)}
  />
  {visibleProductOrderId === order.id && (
    <div className="absolute left-0 z-20 mt-2 w-[300px] max-w-[90vw] overflow-auto bg-white border shadow-xl rounded-md p-4 text-sm">
    <h3 className="font-bold mb-2 text-base">Product Details</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-1 pr-2">Product</th>
            <th className="py-1 pr-2">Qty</th>
            <th className="py-1 pr-2">Unit</th>
            <th className="py-1 pr-2">Rate</th>
            <th className="py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products?.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-1 pr-2">{item.name}</td>
              <td className="py-1 pr-2">{item.quantity}</td>
              <td className="py-1 pr-2">{item.unit}</td>
              <td className="py-1 pr-2">₹{item.price_per_unit.toFixed(2)}</td>
              <td className="py-1">₹{item.order_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={menuIcon}
                    alt="Menu icon"
                    className="min-h-2 min-w-2 cursor-pointer"
                    onClick={() => handleStatusChangeClick(order.id)}
                  />
                  {selectedOrderId === order.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32 z-10"
                    >
                      {["new", "pending", "delivered", "cancel"].map((status) => (
                        <div
                          key={status}
                          onClick={() => handleStatusSelect(status)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      ))}
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-[#003cbe] text-white" : "bg-white text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Order;
