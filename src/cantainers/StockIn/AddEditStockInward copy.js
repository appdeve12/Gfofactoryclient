import React, { useState } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import { BASE_URL } from '../../services/apiRoutes';
import { addstockinward } from '../../services/allService';

import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';

const materialDropdownOptions = [
  { label: "MAP 90 Ammonium Phosphate", value: "MAP 90 Ammonium Phosphate" },
  { label: "HDPE Plastic", value: "HDPE Plastic" },
  { label: "Separation Tube", value: "Separation Tube" },
  { label: "Sensor", value: "Sensor" },
  { label: "Packing & Wrapping Box", value: "Packing & Wrapping Box" },
  { label: "Stand", value: "Stand" },
  { label: "Screw", value: "Screw" },
  { label: "Wall Plack", value: "Wall Plack" }
];

const AddEditStockInward = () => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materialDetails, setMaterialDetails] = useState({});


  const handleMaterialChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    // Add new materials
    selectedOptions.forEach(value => {
      if (!selectedMaterials.includes(value)) {
        setMaterialDetails(prev => ({
          ...prev,
          [value]: {
            purchase_quantity: '',
            purchase_date: '',
            supplier: '',
            remarks: '',
            file: []
          }
        }));
      }
    });

    // Remove deselected materials
    selectedMaterials.forEach(value => {
      if (!selectedOptions.includes(value)) {
        const updatedDetails = { ...materialDetails };
        delete updatedDetails[value];
        setMaterialDetails(updatedDetails);
      }
    });

    setSelectedMaterials(selectedOptions);
  };


  const handleInputChange = (material, field, value) => {
    setMaterialDetails(prev => ({
      ...prev,
      [material]: {
        ...prev[material],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (material, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('media', file);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fileMeta = {
        url: res.data.fileUrl,
        type: file.type
      };

      setMaterialDetails(prev => ({
        ...prev,
        [material]: {
          ...prev[material],
          file: [...prev[material].file, fileMeta]
        }
      }));

      toast.success("File uploaded");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleRemoveMaterial = (material) => {
    setSelectedMaterials(prev => prev.filter(m => m !== material));
    const updatedDetails = { ...materialDetails };
    delete updatedDetails[material];
    setMaterialDetails(updatedDetails);
  };

  const isImage = (type) => type.startsWith('image/');
  const isPDF = (type) => type === 'application/pdf';

const handleSubmit = async (e) => {
  e.preventDefault();

  const entries = selectedMaterials.map(material => ({
    material_Name: material,
    ...materialDetails[material]
  }));

  let allSuccessful = true;

  for (let i = 0; i < entries.length; i++) {
    try {
      const response = await addstockinward(entries[i]); // One by one
      if (response.status !== 201) {
        allSuccessful = false;
        toast.error(`Failed to submit entry for ${entries[i].material_Name}`);
      }
    } catch (error) {
      allSuccessful = false;
      toast.error(`Error submitting ${entries[i].material_Name}`);
    }
  }

  if (allSuccessful) {
    toast.success("All stock inward entries submitted successfully");
    setSelectedMaterials([]);
    setMaterialDetails({});
  }
};

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4>Add Multiple Stock Inward Entries</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
      <Col md={6}>
        <Form.Label>Select Materials</Form.Label>
        <Form.Select
          multiple
          value={selectedMaterials}
          onChange={handleMaterialChange}
        >
          {materialDropdownOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>

            <hr />

            {selectedMaterials.map(material => (
              <Card className="mb-4" key={material}>
                <Card.Header className="d-flex justify-content-between">
                  <strong>{material}</strong>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveMaterial(material)}>Remove</Button>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Input
                           required
                        label="Purchase Quantity"
                        type="number"
                        placeholder="Quantity"
                        value={materialDetails[material]?.purchase_quantity || ''}
                        onChange={(e) => handleInputChange(material, 'purchase_quantity', e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                           required
                        label="Purchase Date"
                        type="date"
                        value={materialDetails[material]?.purchase_date || ''}
                        onChange={(e) => handleInputChange(material, 'purchase_date', e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Supplier"
                        type="text"
                        value={materialDetails[material]?.supplier || ''}
                        onChange={(e) => handleInputChange(material, 'supplier', e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Input
                        label="Remarks"
                        type="text"
                        value={materialDetails[material]?.remarks || ''}
                        onChange={(e) => handleInputChange(material, 'remarks', e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                           required
                        label="Upload File"
                        type="file"
                        onChange={(e) => handleFileUpload(material, e)}
                      />
                    </Col>
                  </Row>

                  {materialDetails[material]?.file?.length > 0 && (
                    <Row>
                      {materialDetails[material].file.map((file, i) => (
                        <Col md={3} key={i}>
                          <Card className="p-2">
                            {isImage(file.type) ? (
                              <img
                                src={`${BASE_URL}${file.url}`}
                                alt="uploaded"
                                style={{ width: '100%', height: 'auto' }}
                              />
                            ) : isPDF(file.type) ? (
                              <a href={`${BASE_URL}${file.url}`} target="_blank" rel="noreferrer">📄 View PDF</a>
                            ) : (
                              <a href={`${BASE_URL}${file.url}`} target="_blank" rel="noreferrer">📁 Download</a>
                            )}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">Submit All</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditStockInward;
