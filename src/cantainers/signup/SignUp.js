import React, { useState } from "react";
import { Form, Card, Container, Row, Col, Alert, Button } from "react-bootstrap";
import Input from "../../components/common/Input";

import CustomDropdown from "../../components/common/CustumDropdoen";
import CustumButton from "../../components/common/CustumButton";
import { registerAdmin } from "../../services/allService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleValueChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      role: "admin"
    }


    if (!payload.name || !payload.email || !payload.password || !payload.role) {
      setError("Please fill in all fields.");
      return;
    }
    const response = await registerAdmin(payload);
    if (response.status == 201) {
      toast.success("User Created Successfully")
                   setTimeout(()=>{
navigate("/dashboard/alladmin")
      },2000)
    }

    setError("");
    // Replace this with actual signup logic
    console.log("Signing up with:", formData);
  };

  const RoleDropdownData = [
    { label: "Admin", value: "admin" },
    { label: "Supervisor", value: "supervisor" },
  ];



  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Add Users</h4>
        </Card.Header>
        <Card.Body>
          <h3 className="text-center mb-4">Create Multiple Users</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form >
            <Row className="mb-3">
              <Col md={4}>
                <Input
                  label="Name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => handleValueChange("name", e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleValueChange("email", e.target.value)}
                />
              </Col>
               <Col md={4}>

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => handleValueChange("password", e.target.value)}
                />
              </Col>
            </Row>
          

            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>

          </Form>


        </Card.Body>
      </Card>

    </div>
  );
};

export default SignUp;
