import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Container from "./Container";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);

const TotalOrderPlaced = () => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [orders, setOrders] = useState([]);

  const tabs = ["Weekly", "Monthly", "Quarterly", "Yearly"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("order_date");

    if (!error) {
      setOrders(data);
    }
  };

const getGroupedData = () => {
  const now = dayjs();
  let labels = [];
  let formatKeyFn;
  let isInCurrent;
  let isInLast;

  if (activeTab === "Weekly") {
    labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    formatKeyFn = (date) => date.format("ddd");

    isInCurrent = (date) => date.isoWeek() === now.isoWeek();
    isInLast = (date) => date.isoWeek() === now.subtract(1, "week").isoWeek();
  } else if (activeTab === "Monthly") {
    labels = dayjs().localeData().monthsShort();// ['Jan', 'Feb', ...]
    formatKeyFn = (date) => date.format("MMM");

    isInCurrent = (date) => date.year() === now.year();
    isInLast = (date) => date.year() === now.subtract(1, "year").year();
  } else if (activeTab === "Quarterly") {
    labels = ["Q1", "Q2", "Q3", "Q4"];
    formatKeyFn = (date) => `Q${Math.floor(date.month() / 3) + 1}`;

    isInCurrent = (date) => date.year() === now.year();
    isInLast = (date) => date.year() === now.subtract(1, "year").year();
  } else if (activeTab === "Yearly") {
    const thisYear = now.year();
    labels = Array.from({ length: 5 }, (_, i) => (thisYear - 4 + i).toString());
    formatKeyFn = (date) => date.year().toString();

    isInCurrent = () => true;
    isInLast = () => false;
  }

  // Initialize base data structure
  const base = labels.map((label) => ({
    name: label,
    current: 0,
    last: 0,
  }));

  orders.forEach((order) => {
    const date = dayjs(order.order_date);
    const key = formatKeyFn(date);

    const entry = base.find((item) => item.name === key);
    if (!entry) return;

    if (isInCurrent(date)) {
      entry.current += 1;
    } else if (isInLast(date)) {
      entry.last += 1;
    }
  });

  return base;
};

  return (
    <Container>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
        <h1 className="font-semibold text-xl">Total Order Placed</h1>
        <div className="bg-[var(--main-bg)] flex items-center rounded-sm cursor-pointer p-1">
          {tabs.map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-sm transition-colors ${
                activeTab === tab
                  ? "bg-white text-[#003CBE]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#DDE1FD]"></span>
          <p className="text-gray-500">
         {activeTab === "Weekly"
          ? "Last Week's Orders"
          : activeTab === "Monthly"
          ? "Last Month's Orders"
          : activeTab === "Quarterly"
          ? "Last Quarter's Orders"
          : "Previous Years"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#6279F6]"></span>
          <p className="text-gray-500">
          {activeTab === "Weekly"
          ? "This Week's Orders"
          : activeTab === "Monthly"
          ? "This Month's Orders"
          : activeTab === "Quarterly"
          ? "This Quarter's  Orders"
          : "This Year"}  
      </p>
        </div>
      </div>

      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getGroupedData()}   margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="last" name="Last Period" fill="#DDE1FD" radius={[4, 4, 0, 0]}  />
            <Bar dataKey="current" name="This Period" fill="#6279F6" radius={[4, 4, 0, 0]}  />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default TotalOrderPlaced;
