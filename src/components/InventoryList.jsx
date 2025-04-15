import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // import supabase client
import Container from "./Container";
import Table from "./Table";

// Function to calculate time difference (e.g., X hours ago)
const timeAgo = (timestamp) => {
  const now = new Date();
  const lastUpdated = new Date(timestamp);
  const diffInSeconds = Math.floor((now - lastUpdated) / 1000);
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products_details")
        .select("*")
        .order("last_updated", { ascending: false }); // Sort by last updated, descending

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleStockIn = async (productId, currentStock) => {
    const newStock = prompt("Enter stock change (positive for stock in, negative for stock out):");
    if (newStock) {
      const updatedStock = currentStock + parseInt(newStock);
  
      // Convert to IST manually
      const now = new Date();
      const ISTOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const istDate = new Date(now.getTime() + ISTOffset);
      const istISOString = istDate.toISOString(); // This will be ahead of UTC time
  
      // Update stock in the products_details table
      const { error } = await supabase
        .from("products_details")
        .update({
          stock: updatedStock,
          last_updated: istISOString,
        })
        .eq("id", productId);
  
      if (error) {
        console.error("Error updating stock:", error);
      } else {
        // Refresh the products after updating stock
        const { data, error: fetchError } = await supabase
          .from("products_details")
          .select("*")
          .order("last_updated", { ascending: false });
  
        if (fetchError) {
          console.error("Error fetching updated products:", fetchError);
        } else {
          setProducts(data);
        }
      }
    }
  };
  

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <div className="flex gap-4 w-[70%]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            placeholder="Search by Product Name"
            className="border border-gray-400 rounded-sm flex-1 outline-none px-2"
          />
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeaderCell>Item</Table.HeaderCell>
          <Table.HeaderCell>Qty</Table.HeaderCell>
          <Table.HeaderCell>Purchase Price</Table.HeaderCell>
          <Table.HeaderCell>Selling Price</Table.HeaderCell>
          <Table.HeaderCell>Last Updated</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {currentProducts.map((product, index) => (
            <Table.Row key={index}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.stock} PCS</Table.Cell>
              <Table.Cell></Table.Cell> {/* Empty for now */}
              <Table.Cell></Table.Cell> {/* Empty for now */}
              <Table.Cell>{product.last_updated ? timeAgo(product.last_updated) : "N/A"}</Table.Cell>
              <Table.Cell>
                <button
                  className="bg-green-100 text-green-800 font-semibold px-4 py-1"
                  onClick={() => handleStockIn(product.id, product.stock)}
                >
                  Stock In
                </button>
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
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#003cbe] text-white" : "bg-white text-black"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default InventoryList;
