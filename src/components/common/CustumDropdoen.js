import React from "react";
import { Form } from "react-bootstrap";

const CustomDropdown = ({ RoleDropdownData = [], onChange, value }) => {
  return (
    <Form.Select aria-label="Role selection" onChange={onChange} value={value}>
      <option value="">Choose The Role</option>
      {RoleDropdownData.map((role, index) => (
        <option key={index} value={role.value}>
          {role.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default CustomDropdown;
