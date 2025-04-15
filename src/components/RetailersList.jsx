import React, { useEffect, useState } from "react";
import Container from "./Container";
import Table from "./Table";
import eyeIcon from "../assets/eye-icon.svg";
import menuIcon from "../assets/menu-icon.svg";
import { supabase } from "../supabaseClient"; // Ensure this path is correct

const RetailersList = () => {
  const [retailers, setRetailers] = useState([]);
  const [filteredRetailers, setFilteredRetailers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRetailers = async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching retailers:", error);
      } else {
        setRetailers(data);
        setFilteredRetailers(data);
      }
    };

    fetchRetailers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = retailers.filter((r) =>
      `${r.business_name} ${r.contact_name} ${r.phone} ${r.contact_location}`
        .toLowerCase()
        .includes(term)
    );
    setFilteredRetailers(filtered);
    setCurrentPage(1);
  }, [searchTerm, retailers]);

  const totalPages = Math.ceil(filteredRetailers.length / itemsPerPage);
  const paginatedRetailers = filteredRetailers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Retailers</h1>

        <div className="flex gap-4 w-[70%]">
          <input
            type="text"
            placeholder="Search by Customer Name/Order No./Value/Area"
            className="border border-gray-400 outline-none px-2 rounded-sm flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select className="bg-[var(--main-bg)] text-[var(--primary-text)] font-semibold p-2 rounded-sm">
            <option value="">Select by Brands</option>
          </select>

          <button className="bg-[var(--primary-text)] text-white px-6 rounded-sm">
            Add Retailers
          </button>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Contact Info.</Table.HeaderCell>
          <Table.HeaderCell>Closing Balance</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {paginatedRetailers.map((retailer) => (
            <Table.Row key={retailer.id}>
              <Table.Cell>{retailer.business_name}</Table.Cell>
              <Table.Cell>{retailer.phone}</Table.Cell>
              <Table.Cell>---</Table.Cell>
              <Table.Cell>
                <img src={eyeIcon} alt="Eye icon" />
              </Table.Cell>
              <Table.Cell>
                <img src={menuIcon} alt="Menu icon" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-[#003cbe] text-white"
                  : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default RetailersList;