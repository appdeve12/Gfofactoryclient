import React from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const CustomDropdown = ({ RoleDropdownData = [], onChange, value }) => {
    const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.value === "add_more") {
      // Navigate to /materialdata
      navigate("/dashboard/add-material-name");
    } else {
      onChange(e); // normal selection
    }
  };
  return (
    <Form.Select aria-label="Role selection" onChange={handleChange} value={value}>
      <option value="">Choose The Role</option>
      {RoleDropdownData.map((role, index) => (
        <option key={index} value={role.value}>
          {role.label}
        </option>
      ))}
            <option value="add_more">---Add More Material---</option>

    </Form.Select>
  );
};

export default CustomDropdown;
