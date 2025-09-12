import React, { useState, useMemo } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";

export default function TableView({ data, onDeleteSelected }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({ key: null, dir: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const rowsPerPage = 4; // <-- limit per page

  if (!data || data.length === 0) return <p className="text-muted">No data available</p>;

  const columns = Object.keys(data[0]);

  // Filter rows based on search
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy.key];
      const bValue = b[sortBy.key];
      const aStr = Array.isArray(aValue) ? aValue.join(",") : String(aValue);
      const bStr = Array.isArray(bValue) ? bValue.join(",") : String(bValue);
      return sortBy.dir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filteredData, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const pageData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleRow = (idx) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSelectAll = () => {
    const allSelected = pageData.every((_, idx) => selectedRows.includes(idx));
    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((i) => !pageData.map((_, idx) => idx).includes(i))
      );
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...pageData.map((_, idx) => idx)])]);
    }
  };

  const handleDelete = () => {
    if (onDeleteSelected) {
      const actualRows = selectedRows.map((idx) => {
        const globalIdx = (currentPage - 1) * rowsPerPage + idx;
        return sortedData[globalIdx];
      });
      onDeleteSelected(actualRows);
      setSelectedRows([]);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={8} className="d-flex justify-content-end gap-2">
          {selectedRows.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={
                  pageData.length > 0 &&
                  pageData.every((_, idx) => selectedRows.includes(idx))
                }
                onChange={toggleSelectAll}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="text-capitalize"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setSortBy((prev) => ({
                    key: col,
                    dir: prev.key === col && prev.dir === "asc" ? "desc" : "asc",
                  }))
                }
              >
                {col} {sortBy.key === col ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length > 0 ? (
            pageData.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={() => toggleRow(idx)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col}>
                    {Array.isArray(row[col]) ? row[col].join(", ") : String(row[col])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-muted">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination buttons only if more than rowsPerPage */}
      {data.length > rowsPerPage && (
        <div className="d-flex justify-content-between mt-2">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
