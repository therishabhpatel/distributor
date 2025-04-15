import React, { useEffect, useState } from "react";
import Container from "./Container";
import Table from "./Table";
import { supabase } from "../supabaseClient";

const TopRetailers = () => {
  const [topRetailers, setTopRetailers] = useState([]);
  const [timeFrame, setTimeFrame] = useState("thisQuarter"); // Default filter

  // Function to get the start date for the selected timeframe
  const getStartDate = (timeFrame) => {
    const now = new Date();

    switch (timeFrame) {
      case "thisWeek":
        const startOfWeek = now.getDate() - now.getDay(); // Get the start of the current week (Sunday)
        now.setDate(startOfWeek);
        now.setHours(0, 0, 0, 0); // Set time to midnight
        return now;
      case "thisMonth":
        now.setDate(1); // Set the date to the 1st of the month
        now.setHours(0, 0, 0, 0);
        return now;
      case "thisYear":
        now.setMonth(0); // Set to January (0)
        now.setDate(1); // Set to the 1st of January
        now.setHours(0, 0, 0, 0);
        return now;
      default:
        // Default to the beginning of the current quarter (you can modify as needed)
        return now;
    }
  };

  useEffect(() => {
    const fetchTopRetailers = async () => {
      const startOfPeriod = getStartDate(timeFrame); // Get the start date based on selected timeframe

      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("customer_name, total_amount, order_date") // Fetching customer_name and total_amount
        .gte("order_date", startOfPeriod.toISOString()) // Only fetch orders after start of selected time period
        .neq("status", "cancel"); // Exclude canceled orders

      const { data: retailers, error: retailerError } = await supabase
        .from("retailers")
        .select("business_name, image_url"); // Fetch business_name and image_url from retailers

      if (orderError || retailerError) {
        console.error("Error fetching data:", orderError || retailerError);
        return;
      }

      // Process orders and group by customer_name
      const retailerData = {};

      // Loop through each order and aggregate by customer_name
      orders.forEach((order) => {
        const { customer_name, total_amount } = order;

        if (retailerData[customer_name]) {
          // Update existing retailer data with new total and increment order count
          retailerData[customer_name].orders += 1;
          retailerData[customer_name].value += total_amount;
        } else {
          // Initialize retailer data if it's the first occurrence
          retailerData[customer_name] = {
            name: customer_name,
            orders: 1,
            value: total_amount,
            image_url: null, // Placeholder for retailer image
          };
        }
      });

      // Add images from the retailers table by comparing business_name with customer_name
      retailers.forEach((retailer) => {
        if (retailerData[retailer.business_name]) {
          retailerData[retailer.business_name].image_url = retailer.image_url;
        }
      });

      // Convert the retailer data object into an array, sort by orders, and limit to top 5 retailers
      const sortedRetailers = Object.values(retailerData)
        .sort((a, b) => b.orders - a.orders) // Sort by number of orders (descending)
        .slice(0, 5); // Limit to top 5 retailers

      setTopRetailers(sortedRetailers);
    };

    fetchTopRetailers();
  }, [timeFrame]); // Re-run when the selected time frame changes

  return (
    <Container className="overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Top Retailers</h1>

        <select
          className="bg-[var(--main-bg)] text-gray-500 p-2 rounded-sm"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)} // Update the selected time frame
        >
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="thisQuarter">This Quarter</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Orders</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {topRetailers.map((retailer, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {retailer.image_url ? (
                    <img
                      src={retailer.image_url}
                      alt={retailer.name}
                      className="w-12 h-12 object-cover rounded-full" // Image scaling to fit
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </Table.Cell>
                <Table.Cell>{retailer.name}</Table.Cell>
                <Table.Cell>{retailer.orders}</Table.Cell>
                <Table.Cell>{retailer.value.toFixed(2)} Rs</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default TopRetailers;
