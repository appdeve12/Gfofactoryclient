import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import { BASE_URL } from '../../services/apiRoutes';
import { addstockinward } from '../../services/allService';

import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddEditStockInward = () => {
      const navigate=useNavigate()
  const materialdata=useSelector(state=>state.material.allmaterial);
  const [materialdropdownm,setmatrialdropdown]=useState([])
  useEffect(()=>{
const materialDropdownOptions=materialdata.map((item,index)=>({
  label:item.name,
  value:item._id
}))
setmatrialdropdown(materialDropdownOptions)
  },[materialdata])
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  console.log("selectedMaterials",selectedMaterials)
  const [materialDetails, setMaterialDetails] = useState({});

  const handleMaterialToggle = (value) => {
    debugger;
    if (selectedMaterials.includes(value)) {
      // Remove material
      setSelectedMaterials(prev => prev.filter(item => item !== value));
      const updatedDetails = { ...materialDetails };
      delete updatedDetails[value];
      setMaterialDetails(updatedDetails);
    } else {
      // Add material
      setSelectedMaterials(prev => [...prev, value]);
      setMaterialDetails(prev => ({
        ...prev,
        [value]: {
          purchase_quantity: '',
          purchase_date: new Date().toISOString().split("T")[0],
          supplier: '',
          remarks: '',
          file: []
        }
      }));
    }
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
const handleRemoveFile = async (material, index) => {
  const fileToDelete = materialDetails[material].file[index];
  const filename = fileToDelete.url.split('/').pop(); // extract filename from URL

  try {
    await axios.delete(`${BASE_URL}/delete/${filename}`);
    
    // Remove file from state
    setMaterialDetails(prev => ({
      ...prev,
      [material]: {
        ...prev[material],
        file: prev[material].file.filter((_, i) => i !== index)
      }
    }));

    toast.success("File deleted successfully");
  } catch (error) {
    toast.error("Failed to delete file");
  }
};

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
if(response.status==201){
                         setTimeout(()=>{
navigate("/dashboard/stock-inward")
      },2000)}
    } catch (error) {
      allSuccessful = false;
  const errorMessage = error?.response?.data?.message || `Error submitting ${entries[i].material_Name}`;
  toast.error(errorMessage);
    }
  }

  if (allSuccessful) {
    toast.success("All stock inward entries submitted successfully");
    setSelectedMaterials([]);
    setMaterialDetails({});
  }
};

  return (
    <div className="container mt-4 overflows"style={{}}>
      <Card>
        <Card.Header>
          <h4>Add Multiple Stock Inward Entries</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* <h5>Select Materials</h5> */}
            {/* <Row className="mb-3">
              {materialdropdownm.map(opt => (
                <Col md={3} key={opt.value}>
                  <Form.Check
                    type="checkbox"
                    label={opt.label}
                    checked={selectedMaterials.includes(opt.value)}
                    onChange={() => handleMaterialToggle(opt.value)}
                  />
                </Col> 
              ))}
            </Row> */}
                  <Row className="mb-3">
                          <Col md={6}>
                            <Form.Label>Select Material</Form.Label>
                            <CustomDropdown
                              RoleDropdownData={materialdropdownm}
                              onChange={(e) => handleMaterialToggle(e.target.value)}
                              value=""
                            />
                          </Col>
                        </Row>

            <hr />

            {selectedMaterials.map(material => (
              <Card className="mb-4" key={material}>
                <Card.Header className="d-flex justify-content-between">
                  <strong>{materialdropdownm.find((item,index)=>(item.value==material)).label}</strong>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveMaterial(material)}>Remove</Button>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Input
                        label="Purchase Quantity"
                        type="number"
                        placeholder="Quantity"
                        value={materialDetails[material]?.purchase_quantity || ''}
                        onChange={(e) => handleInputChange(material, 'purchase_quantity', e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
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
        <Card className="p-2 position-relative">
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
          {/* Delete button */}
          <Button
            variant="danger"
            size="sm"
            style={{ position: 'absolute', top: 5, right: 5 }}
            onClick={() => handleRemoveFile(material, i)}
          >
            ✖
          </Button>
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
