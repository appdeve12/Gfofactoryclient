import React, { useState } from 'react';
import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addstockoutward } from '../../services/allService';
import { useNavigate } from 'react-router-dom';


const AddStockOutward = () => {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    material_Name: '',
    quantity_used: '',
    purpose: '',
    date: '',
  });

  const material_Name_dropdown = [
    { label: "MAP 90 Ammonium Phosphate", value: "MAP 90 Ammonium Phosphate" },
    { label: "HDPE Plastic", value: "HDPE Plastic" },
    { label: "Separation Tube", value: "Separation Tube" },
    { label: "Sensor", value: "Sensor" },
    { label: "Packing & Wrapping Box", value: "Packing & Wrapping Box" },
    { label: "Stand", value: "Stand" },
    { label: "Screw", value: "Screw" },
    { label: "Wall Plack", value: "Wall Plack" }
  ];

  const handleValueChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelect = (value) => {
    handleValueChange('material_Name', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addstockoutward(formData);
      if (response.status === 201) {
        toast.success("Stock Outward added successfully!");
   
        setFormData({
          material_Name: '',
          quantity_used: '',
          purpose: '',
          date: '',
        });
        navigate("/stock-outward")
      } else {
        toast.error("Failed to add stock outward.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Add Stock Outward</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Material Name</Form.Label>
                <CustomDropdown
                  RoleDropdownData={material_Name_dropdown}
                  onChange={(e) => handleSelect(e.target.value)}
                  value={formData.material_Name}
                />
              </Col>

              <Col md={4}>
                <Input
                  label="Quantity Used"
                  type="number"
                  placeholder="Enter Quantity Used"
                  value={formData.quantity_used}
                  onChange={(e) => handleValueChange("quantity_used", e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Input
                  label="Date"
                  type="date"
                  placeholder="Select Date"
                  value={formData.date}
                  onChange={(e) => handleValueChange("date", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Input
                  label="Purpose"
                  type="text"
                  placeholder="Enter Purpose"
                  value={formData.purpose}
                  onChange={(e) => handleValueChange("purpose", e.target.value)}
                />
              </Col>
            </Row>

            <div className="text-end mt-4">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddStockOutward;
