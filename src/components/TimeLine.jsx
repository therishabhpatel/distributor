import React from "react";
import Container from "./Container";
import Table from "./Table";

const TimeLine = () => {
  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Timeline</h1>

        <div className="flex gap-4 w-[70%]">
          <input
            type="text"
            placeholder="Search by Customer Name/Order No./Value/Area"
            className="border border-gray-400 rounded-sm outline-none px-2 flex-1"
          />

          <select className="bg-[var(--main-bg)] text-[var(--primary-text)] rounded-sm p-2">
            {/* More options will come here */}
            <option value="">Select by Brands</option>
          </select>

          <select className="bg-[var(--main-bg)] text-[var(--primary-text)] rounded-sm p-2">
            <option value="">Selelct by Categories</option>
          </select>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeaderCell>Item</Table.HeaderCell>
          <Table.HeaderCell>Stock in</Table.HeaderCell>
          <Table.HeaderCell>Pending</Table.HeaderCell>
          <Table.HeaderCell>Stock out</Table.HeaderCell>
          <Table.HeaderCell>Last Updated</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {/* more data will come here based on api */}
          <Table.Row>
            <Table.Cell>Savory crunchy peanut butter</Table.Cell>
            <Table.Cell>12 PCS</Table.Cell>
            <Table.Cell>---</Table.Cell>
            <Table.Cell>---</Table.Cell>
            <Table.Cell>Mon 11:47 PM</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  );
};

export default TimeLine;
