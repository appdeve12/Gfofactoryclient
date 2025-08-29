import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';
import { Button, Form,Card,Row,Col } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../services/apiRoutes';
import { addstockinward, editparticulrstockinward, getparticulrstockinward } from '../../services/allService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const EditStockInward = () => {
      const navigate=useNavigate()
    const { id } = useParams(); 
    console.log(id)
  const [formData, setFormData] = useState({
    material_Name: '',
    purchase_quantity: '',
    purchase_date: '',
    supplier: '',
    remarks: '',
    file: [] // array of { url, type }
  });

  const materialdata=useSelector(state=>state.material.allmaterial);
  const [materialdropdownm,setmatrialdropdown]=useState([])
  useEffect(()=>{
const material_Name_dropdown=materialdata.map((item,index)=>({
  label:item.name,
  value:item._id
}))
setmatrialdropdown(material_Name_dropdown)
  },[materialdata])

  const handleValueChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const fetcchpartivulruserdata = async () => {
  if (!id) return;

  try {
    const response = await getparticulrstockinward(id);
    if (response.status === 200) {
      const data = response.data.material;

      // Format purchase_date for input type="date"
      const formattedDate = data.purchase_date ? data.purchase_date.slice(0, 10) : '';

      setFormData({
        material_Name: data.material_Name || '',
        purchase_quantity: data.purchase_quantity || '',
        purchase_date: formattedDate,
        supplier: data.supplier || '',
        remarks: data.remarks || '',
        file: data.file || [],
      });
    }
  } catch (error) {
    console.error("Error fetching material:", error);
  }
};

useEffect(() => {
  fetcchpartivulruserdata();
}, [id]);

  const handleSelect = (e) => {
    handleValueChange('material_Name', e.target.value);
  };

 
  const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          let response;
          if (id) {
              response = await editparticulrstockinward(id, formData);
              if (response.status === 200) {
                  toast.success("Updated successfully");
                             setTimeout(()=>{
navigate("/dashboard/stock-inward")
      },2000)
              }
          } 
      } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("Operation failed");
      }
  };

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return alert("Please select a file");

    const uploadFormData = new FormData();
    uploadFormData.append('media', selectedFile);

    try {
      const res = await axios.post('http://localhost:5050/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFileUrl = res.data.fileUrl;

      const fileMeta = {
        url: uploadedFileUrl,
        type: selectedFile.type
      };

      setFormData(prev => ({
        ...prev,
        file: [...(prev.file || []), fileMeta]
      }));

      alert('File uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const isImage = (type) => type.startsWith('image/');
  const isPDF = (type) => type === 'application/pdf';

  return (
       <div className="container mt-4">
      <Card>
     <Card.Header>
  <h4 className="mb-0">{id ? "Edit Stock Inward" : "Add Stock Inward"}</h4>
</Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Material Name</Form.Label>
                <CustomDropdown RoleDropdownData={materialdropdownm} onChange={handleSelect}   value={formData.material_Name}/>
              </Col>

              <Col md={4}>
                <Input
                  label="Purchase Quantity"
                  type="number"
                  placeholder="Enter purchase quantity"
                  value={formData.purchase_quantity}
                  onChange={(e) => handleValueChange("purchase_quantity", e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Input
                  label="Purchase Date"
                  type="date"
                  placeholder="Select purchase date"
                  value={formData.purchase_date}
                  onChange={(e) => handleValueChange("purchase_date", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Input
                  label="Supplier"
                  type="text"
                  placeholder="Enter supplier name"
                  value={formData.supplier}
                  onChange={(e) => handleValueChange("supplier", e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Input
                  label="Remarks"
                  type="text"
                  placeholder="Enter remarks"
                  value={formData.remarks}
                  onChange={(e) => handleValueChange("remarks", e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Input
                  label="Upload File"
                  type="file"
                  placeholder="Choose file"
                  onChange={handleFile}
                />
              </Col>
            </Row>

            {/* File Preview Section */}
            {formData.file.length > 0 && (
              <>
                <h5 className="mt-4 mb-2">Uploaded Files Preview:</h5>
                <Row className="mb-3">
                  {formData.file.map((item, idx) => (
                    <Col md={3} key={idx} className="mb-3">
                      <Card className="p-2">
                        {isImage(item.type) ? (
                          <img
                            src={`${BASE_URL}${item.url}`}
                            alt={`uploaded-${idx}`}
                            style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                          />
                        ) : isPDF(item.type) ? (
                          <a href={`${BASE_URL}${item.url}`} target="_blank" rel="noopener noreferrer">
                            📄 View PDF
                          </a>
                        ) : (
                          <a href={`${BASE_URL}${item.url}`} target="_blank" rel="noopener noreferrer">
                            📁 Download File
                          </a>
                        )}
                        <p className="mt-2 mb-0" style={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>
                          {item.type}
                        </p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

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

export default EditStockInward;

