import React, { useEffect, useState } from "react";
import Container from "./Container";
import Table from "./Table";
import { supabase } from "../supabaseClient";

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
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
    const fetchTopProducts = async () => {
      const startOfPeriod = getStartDate(timeFrame); // Get the start date based on selected timeframe

      const { data, error } = await supabase
        .from("orders")
        .select("products, order_date") // Fetching products and order_date
        .gte("order_date", startOfPeriod.toISOString()) // Only fetch orders after start of selected time period
        .neq("status", "cancel"); // Exclude canceled orders

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      // Process products
      const productData = {};

      // Loop through each order's products
      for (const order of data) {
        const products = Array.isArray(order.products) ? order.products : JSON.parse(order.products);

        for (const product of products) {
          const { name, quantity, order_price } = product;

          if (productData[name]) {
            // Update existing product data with new quantity and price
            productData[name].quantity += quantity;
            productData[name].value += order_price;
          } else {
            // Initialize product data if it's the first occurrence
            productData[name] = {
              name,
              quantity,
              value: order_price,
            };
          }
        }
      }

      // Convert the product data object into an array
      const topProductsList = Object.values(productData)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Limit to top 5 products

      // Fetch product details (image, price, etc.) from the products_details table
      const productDetailsPromises = topProductsList.map(async (product) => {
        const { data, error } = await supabase
          .from("products_details")
          .select("image_path, price_per_box, unit")
          .eq("name", product.name) // Match by name
          .single(); // Assuming name is unique in products_details

        if (error) {
          console.error("Error fetching product details:", error);
          return product; // Return the product without details if there's an error
        }

        // Merge product details with the existing product data
        return {
          ...product,
          image: data?.image_path || "", // Add the image path if it exists
          price_per_box: data?.price_per_box || 0,
          unit: data?.unit || "N/A",
        };
      });

      // Wait for all product details to be fetched
      const detailedProducts = await Promise.all(productDetailsPromises);

      setTopProducts(detailedProducts);
    };

    fetchTopProducts();
  }, [timeFrame]); // Re-run when the selected time frame changes

  return (
    <Container className="overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Top Products</h1>

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
            {topProducts.map((product, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {/* Display product image */}
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain" // Image scaling to fit
                    />
                  )}
                </Table.Cell>
                <Table.Cell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.name}
                </Table.Cell>
                <Table.Cell>{product.quantity}</Table.Cell>
                <Table.Cell>{product.value.toFixed(2)} Rs</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default TopProducts;
