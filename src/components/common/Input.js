import React, { useState } from 'react';
import { Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons

const Input = ({  required, label, type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <Form.Group className="mb-4 position-relative" controlId={`form-${label}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
      required={required}
        type={inputType}
        placeholder={placeholder}
        {...(type !== 'file' ? { value: value } : {})}
        onChange={onChange}
        autoComplete="off"
      />
      {isPasswordType && (
        <span
          onClick={toggleVisibility}
          style={{
            position: 'absolute',
            top: '73%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#6c757d'
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </Form.Group>
  );
};

export default Input;
