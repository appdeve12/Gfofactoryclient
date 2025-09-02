
import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addstockoutward } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../services/apiRoutes';
const AddStockOutward = () => {
  const navigate = useNavigate();

  // formData now holds an array of selected materials and a shared purpose
  const [formData, setFormData] = useState({
    materials: [], // [{ material_Id: '', quantity_used: '', date: '' }]
    purpose: '',
  });
  console.log("formData", formData)
  // Redux material data
  const materialdata = useSelector(state => state.material.allmaterial);
  const [materialDropdown, setMaterialDropdown] = useState([]);

  useEffect(() => {
    const dropdownData = materialdata.map(item => ({
      label: item.name,
      value: item._id,
    }));
    setMaterialDropdown(dropdownData);
  }, [materialdata]);

  // Add material to materials array when selected
  const handleSelect = (materialId) => {
    const exists = formData.materials.find(m => m.material_Id === materialId);
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        materials: [
          ...prev.materials,
          {
            material_Id: materialId,
            quantity_used: '',
            file: {},
            date: new Date().toISOString().split("T")[0], // today
          }
        ]
      }));
    }
  };

  // Update quantity used for a material
  const handleQuantityChange = (index, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index].quantity_used = value;
    setFormData(prev => ({ ...prev, materials: newMaterials }));
  };

  // Remove material from the list if needed
  const handleRemoveMaterial = (index) => {
    const newMaterials = [...formData.materials];
    newMaterials.splice(index, 1);
    setFormData(prev => ({ ...prev, materials: newMaterials }));
  };

  // Update shared purpose
  const handlePurposeChange = (value) => {
    setFormData(prev => ({ ...prev, purpose: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.materials.length === 0) {
      toast.error("Please select at least one material.");
      return;
    }

    try {
      for (let mat of formData.materials) {
        if (!mat.quantity_used) {
          toast.error("Please enter quantity used for all selected materials.");
          return;
        }
        console.log("mat", mat)
        // Transform payload to match backend schema
        const payload = {
          material_Name: mat.material_Id, // rename to match schema
          quantity_used: Number(mat.quantity_used), // convert to number
          date: mat.date,
          file: mat.file,
          purpose: formData.purpose,
        };

        const response = await addstockoutward(payload);
        if (response.status === 201) {
          toast.success(`Stock Outward for ${mat.material_Id} added successfully!`);
        } else {
          toast.error(`Failed to add stock outward for ${mat.material_Id}.`);
        }
      }

      // Reset form after all materials processed
      setFormData({ materials: [], purpose: '' });
      setTimeout(() => navigate("/dashboard/stock-outward"), 2000);

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong.");
    }
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
      console.log("res", res)

      const newMaterials = [...formData.materials];
      newMaterials[material].file = { "url": res.data.fileUrl, "type": file.type }
      setFormData(prev => ({ ...prev, materials: newMaterials }));

      toast.success("File uploaded");
    } catch (error) {
      toast.error("Upload failed");
    }
  };
  const isImage = (type) => {
    return type.startsWith('image/');
  };

  const isPDF = (type) => {
    return type === 'application/pdf';
  };
  const handleRemoveFile = (materialIndex) => {
    const newMaterials = [...formData.materials];
    newMaterials[materialIndex].file = {};
    setFormData(prev => ({ ...prev, materials: newMaterials }));
  };

  return (
    <div className="container mt-4 overflows">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Add Stock Outward</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Material Selection */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Select Material</Form.Label>
                <CustomDropdown
                  RoleDropdownData={materialDropdown}
                  onChange={(e) => handleSelect(e.target.value)}
                  value=""
                />
              </Col>
            </Row>

            {/* Dynamic Material Rows */}
            {formData.materials.map((mat, index) => {
              const materialInfo = materialDropdown.find(m => m.value === mat.material_Id);
              return (

                <Row key={index} className="mb-3 align-items-end">
                  <Row className='d-flex' style={{ justifyContent: "end" }}>
                    <Col md={2}>
                      <div className='mb-4 position-relative'>
                        <Button variant="danger" onClick={() => handleRemoveMaterial(index)}>
                          Remove
                        </Button>
                      </div>
                    </Col></Row>
                  <Col md={3}>
                    <div className='mb-4 position-relative'>
                      <Form.Label>Material Name</Form.Label>
                      <Form.Control type="text" value={materialInfo?.label} disabled />
                    </div>
                  </Col>

                  <Col md={3}>
                    <Input
                      label="Quantity Used"
                      type="number"
                      value={mat.quantity_used}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </Col>

                  <Col md={3}>
                    <Input
                      label="Date"
                      type="date"
                      value={mat.date}
                      disabled
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      label="Upload File"
                      type="file"
                      onChange={(e) => handleFileUpload(index, e)}
                    />
                  </Col>
                  {mat.file && mat.file.url && (
                    <Col md={3} className="mt-2">
                      <Card className="p-2 position-relative">
                        {isImage(mat.file.type) ? (
                          <img
                            src={`${BASE_URL}${mat.file.url}`}
                            alt="uploaded"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        ) : isPDF(mat.file.type) ? (
                          <a href={`${BASE_URL}${mat.file.url}`} target="_blank" rel="noreferrer">
                            📄 View PDF
                          </a>
                        ) : (
                          <a href={`${BASE_URL}${mat.file.url}`} target="_blank" rel="noreferrer">
                            📁 Download File
                          </a>
                        )}

                        <Button
                          variant="danger"
                          size="sm"
                          style={{ position: 'absolute', top: 5, right: 5 }}
                          onClick={() => handleRemoveFile(index)}
                        >
                          ✖
                        </Button>
                      </Card>
                    </Col>
                  )}

                </Row>
              );
            })}

            {/* Purpose */}
            <Row className="mb-3">
              <Col md={6}>
                <Input
                  label="Purpose"
                  type="text"
                  placeholder="Enter Purpose"
                  value={formData.purpose}
                  onChange={(e) => handlePurposeChange(e.target.value)}
                />
              </Col>
            </Row>

            {/* Submit */}
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
