import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/common/Input';
import CustomDropdown from '../../components/common/CustumDropdoen';
import { getparticulrstockoutward, getStockOutwardById, updateparticulrstock, updateStockOutward } from '../../services/allService';
import axios from 'axios';
import { BASE_URL } from '../../services/apiRoutes';

const EditStockOutward = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    material_Id: '',
    quantity_used: '',
    purpose: '',
    date: '',
    file: {}
  });


  // Fetch data for editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getparticulrstockoutward(id);
        if (res.data.success) {
          const data = res.data.stockOutward;

          setFormData({
            material_Id: data.material_Name._id,
            quantity_used: data.quantity_used,
            quantity_unit:data.quantity_unit,
            purpose: data.purpose,
            date: data.date.split("T")[0],
            file: data.file || {}
          });
        }
      } catch (error) {
        toast.error("Error loading stock outward details.");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    debugger;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handlequantityunitChange=(field,value)=>{
      debugger;
  
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("media", file);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData(prev => ({
        ...prev,
        file: { url: res.data.fileUrl, type: file.type }
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed.");
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: {} }));
  };

  const handleSubmit = async () => {
    debugger;
    if (!formData.quantity_used ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        material_Name: formData.material_Id,
        quantity_used: Number(formData.quantity_used),
        quantity_unit:formData.quantity_unit,
        purpose: formData.purpose,
        date: formData.date,
        file: formData.file
      };

      const res = await updateparticulrstock(id, payload);
console.log("res",res)
      if (res.status==200) {
        toast.success("Stock outward updated successfully!");
        navigate("/dashboard/stock-outward");
      }
    } catch (err) {
      toast.error("Error updating stock outward.");
      console.error(err);
    }
  };

  const isImage = (type) => type?.startsWith("image/");
  const isPDF = (type) => type === "application/pdf";

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Edit Stock Outward</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            {/* Material Dropdown (Optional if editable) */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Material</Form.Label>
                <Form.Control type="text" value={formData.material_Id} disabled />
              </Col>
            </Row>

            {/* Quantity */}
            <Row className="mb-3">
              <Col md={6}>
                <Input
                required
                  label="Quantity Used"
                  type="number"
                  name="quantity_used"
                  value={formData.quantity_used}
                  onChange={handleChange}
                    unitInput
                    unitValue={formData?.quantity_unit || ''}
                  
                   onUnitChange={(e)=>handlequantityunitChange("quantity_unit",e.target.value)}
                />
                  
    
              </Col>

              <Col md={6}>
                <Input
                   required
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            {/* Purpose */}
            <Row className="mb-3">
              <Col md={6}>
                <Input
                  label="Purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            {/* File Upload */}
            <Row className="mb-3">
              <Col md={6}>
                <Input
                  label="Upload File"
                  type="file"
                  onChange={handleFileUpload}
                />
              </Col>
              {formData.file?.url && (
                <Col md={4}>
                  <Card className="p-2 position-relative">
                    {isImage(formData.file.type) ? (
                      <img
                        src={`${BASE_URL}${formData.file.url}`}
                        alt="uploaded"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    ) : isPDF(formData.file.type) ? (
                      <a href={`${BASE_URL}${formData.file.url}`} target="_blank" rel="noreferrer">
                        📄 View PDF
                      </a>
                    ) : (
                      <a href={`${BASE_URL}${formData.file.url}`} target="_blank" rel="noreferrer">
                        📁 Download File
                      </a>
                    )}

                    <Button
                      variant="danger"
                      size="sm"
                      style={{ position: 'absolute', top: 5, right: 5 }}
                      onClick={handleRemoveFile}
                    >
                      ✖
                    </Button>
                  </Card>
                </Col>
              )}
            </Row>

            <div className="text-end">
              <Button variant="primary" onClick={handleSubmit}>
                Update Stock Outward
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditStockOutward;
