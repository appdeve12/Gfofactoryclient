import React, { useState } from 'react';
import { Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
  required,
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  unitInput,
  unitValue,
  onUnitChange
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  // Units options
  const unitOptions = ["kg", "pcs"];

  return (
    <Form.Group className="mb-4" controlId={`form-${label}`}>
      <Form.Label>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Form.Label>

      {unitInput ? (
        <InputGroup>
          <Form.Control
            required={required}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="off"
          />
          {/* Unit input with datalist for dropdown + free input */}
          <Form.Control
            list="unit-list"
            style={{ maxWidth: "100px" }}
            placeholder="Unit"
            value={unitValue}
            onChange={onUnitChange}
          />
          <datalist id="unit-list">
            {unitOptions.map((unit) => (
              <option key={unit} value={unit} />
            ))}
          </datalist>
        </InputGroup>
      ) : (
        <div style={{ position: "relative" }}>
          <Form.Control
            required={required}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="off"
          />
          {isPasswordType && (
            <span
              onClick={toggleVisibility}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>
      )}
    </Form.Group>
  );
};

export default Input;
