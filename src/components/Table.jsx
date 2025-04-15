import React from "react";

const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto py-4">
      <table className="min-w-full text-sm text-left text-gray-700">
        {children}
      </table>
    </div>
  );
};

const Head = ({ children }) => (
  <thead className="bg-[var(--main-bg)] text-gray-900">
    <tr>{children}</tr>
  </thead>
);

const Body = ({ children }) => <tbody>{children}</tbody>;

const Row = ({ children }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
    {children}
  </tr>
);

const Cell = ({ children }) => (
  <td className="px-4 py-4 whitespace-nowrap">{children}</td>
);

const HeaderCell = ({ children }) => (
  <th className="px-4 py-4 font-medium">{children}</th>
);

// Attach sub-components to main Table
Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.HeaderCell = HeaderCell;

export default Table;
