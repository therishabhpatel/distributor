import React, { useEffect, useState } from "react";
import Container from "./Container";
import piplodIcon from "../assets/piplod-icon.svg";
import { supabase } from "../supabaseClient";

const TodaysOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchTodayOrders = async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("customer_name, billing_address, total_amount, products")
        .gte("order_date", startOfDay.toISOString())
        .order("order_date", { ascending: false })
        .limit(5); // Limit to 5 for now

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      const cleaned = data.map((order) => {
        const roadMatch = order.billing_address.match(/([^,]*Road)/i);
        const address = roadMatch ? roadMatch[0] : order.billing_address.split(",")[0];

        let ordValue = 0;
        try {
          const productList = Array.isArray(order.products)
            ? order.products
            : JSON.parse(order.products);

          ordValue = productList.reduce((sum, item) => sum + (item.quantity || 0), 0);
        } catch (e) {
          console.warn("Invalid products JSON", order.products);
        }

        return {
          name: order.customer_name,
          address,
          total: order.total_amount,
          ordValue,
        };
      });

      setOrders(cleaned);
    };

    fetchTodayOrders();
  }, []);

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Today's Orders</h1>
        <button className="bg-[var(--main-bg)] text-[var(--primary-text)] px-3 py-2 rounded-sm font-semibold">
          See All
        </button>
      </div>

      {orders.map((order, index) => (
        <div
          key={index}
          className="m-2 p-2 border border-gray-400 flex items-center gap-4 rounded-md"
        >
          <div>
            <img src={piplodIcon} alt="Image of product" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">{order.name}</h1>
              <p className="text-[var(--primary-text)] font-semibold">
                {order.total.toFixed(2)} Rs
              </p>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-gray-500">{order.address}</h1>
              <p className="text-green-700 font-semibold">
                Ord Value: {order.ordValue}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default TodaysOrder;
