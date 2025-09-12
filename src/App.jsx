import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import usersData from "./data/users.json";
import permissionsData from "./data/permissions.json";
import rolesData from "./data/roles.json";
import hierarchyData from "./data/hierarchy.json";
import { Container, Row, Col, Button } from "react-bootstrap";

const tableOrder = ["users", "permissions", "roles", "hierarchy"];

function App() {
  const [active, setActive] = useState("users");
  const [users, setUsers] = useState(usersData);
  const [permissions, setPermissions] = useState(permissionsData);
  const [roles, setRoles] = useState(rolesData);
  const [hierarchy, setHierarchy] = useState(hierarchyData);
  const [undoStack, setUndoStack] = useState([]);

  const dataMap = { users, permissions, roles, hierarchy };
  const setDataMap = { users: setUsers, permissions: setPermissions, roles: setRoles, hierarchy: setHierarchy };

  // Delete selected rows
  const handleDeleteSelected = (rowsToDelete) => {
    const key = active;
    const currentData = dataMap[key];
    const deletedWithIndex = rowsToDelete.map((row) => ({
      row,
      index: currentData.indexOf(row),
    }));
    const newData = currentData.filter((row) => !rowsToDelete.includes(row));
    setDataMap[key](newData);
    setUndoStack((prevStack) => [...prevStack, { key, rows: deletedWithIndex }]);
  };

  // Undo last deletion
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const { key, rows } = last;
    const currentData = [...dataMap[key]];
    rows.forEach(({ row, index }) => {
      currentData.splice(index, 0, row);
    });
    setDataMap[key](currentData);
    setUndoStack((prevStack) => prevStack.slice(0, -1));
  };

  // Navigate tables
  const currentIndex = tableOrder.indexOf(active);
  const goNext = () => {
    if (currentIndex < tableOrder.length - 1) setActive(tableOrder[currentIndex + 1]);
  };
  const goPrevious = () => {
    if (currentIndex > 0) setActive(tableOrder[currentIndex - 1]);
  };

  return (
    <Container fluid className="p-0">
      <Row noGutters>
        <Col xs="auto">
          <Sidebar active={active} setActive={setActive} />
        </Col>
        <Col className="p-4">
          <header className="mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-capitalize">{active}</h2>
            <span className="text-muted">Admin Console</span>
          </header>

          <div className="mb-3 d-flex justify-content-start gap-2">
            {undoStack.some((item) => item.key === active) && (
              <Button variant="warning" size="sm" onClick={handleUndo}>
                Undo Delete
              </Button>
            )}
          </div>

          <div className="bg-white p-3 rounded shadow-sm">
            <TableView
              data={dataMap[active]}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>

          {/* Table Navigation */}
          <div className="d-flex justify-content-between mt-3">
            {currentIndex > 0 ? (
              <Button variant="secondary" onClick={goPrevious}>
                Previous
              </Button>
            ) : <div></div>}

            {currentIndex < tableOrder.length - 1 ? (
              <Button variant="secondary" onClick={goNext}>
                Next
              </Button>
            ) : <div></div>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
