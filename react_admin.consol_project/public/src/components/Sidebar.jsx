import React from "react";
import { Nav } from "react-bootstrap";

const items = [
  { key: "users", label: "Users" },
  { key: "permissions", label: "Permissions" },
  { key: "roles", label: "Roles" },
  { key: "hierarchy", label: "Hierarchy" }
];

export default function Sidebar({ active, setActive }) {
  return (
    <Nav className="flex-column bg-light vh-100 p-3 border-end" style={{ width: "250px" }}>
      <h5 className="mb-4">Admin Console</h5>
      {items.map((it) => (
        <Nav.Item key={it.key} className="mb-2">
          <Nav.Link
            active={active === it.key}
            onClick={() => setActive(it.key)}
            style={{ cursor: "pointer" }}
          >
            {it.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
