import React from 'react'
import { Form } from "react-bootstrap";

const Input = ({ label, type, placeholder, value, onChange }) => {
  return (
    <Form.Group className="mb-4" controlId={`form-${label}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        {...(type !== 'file' ? { value: value } : {})}
        onChange={onChange}
        autoComplete="off"
      />
    </Form.Group>
  );
};

export default Input;
