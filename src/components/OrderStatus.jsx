import React, { useEffect, useState } from "react";
import Container from "./Container";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { supabase } from "../supabaseClient";

const COLORS = ["#83bd56", "#ffd72b", "#f14035",  "#4040e6"]; // green, yellow, red, blue

const getStartDate = (filter) => {
  const now = new Date();
  if (filter === "thisWeek") {
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return firstDayOfWeek.toISOString();
  }
  if (filter === "thisMonth") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  if (filter === "thisYear") {
    return new Date(now.getFullYear(), 0, 1).toISOString();
  }
  return null;
};

const OrderStatus = () => {
  const [statusData, setStatusData] = useState([]);
  const [filter, setFilter] = useState("thisWeek");

  useEffect(() => {
    const fetchOrderStatuses = async () => {
      const fromDate = getStartDate(filter);

      const { data, error } = await supabase
        .from("orders")
        .select("status, order_date")
        .gte("order_date", fromDate);

      if (error) {
        console.error("Error fetching order status:", error);
        return;
      }

      const statusCount = {
        delivered: 0,
        pending: 0,
        cancel: 0,
        new : 0,
      };

      data.forEach((order) => {
        if (statusCount[order.status]) {
          statusCount[order.status]++;
        } else {
          statusCount[order.status] = 1;
        }
      });

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0);

      const chartData = Object.entries(statusCount).map(([status, count]) => ({
        name: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
      }));

      setStatusData(chartData);
    };

    fetchOrderStatuses();
  }, [filter]);

  return (
    <Container className="flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">Order Status</h1>

        <select
          className="bg-[var(--main-bg)] p-2 rounded-md text-gray-600"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      <div className="flex justify-center py-4">
        <PieChart width={250} height={250}>
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={false}
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip  formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </div>

      <div className="space-y-2">
        {statusData.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></span>
              <p>{item.name}</p>
            </div>
            <p className="font-bold">{item.value}%</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default OrderStatus;
