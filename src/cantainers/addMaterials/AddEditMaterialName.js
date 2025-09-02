
import React, { useEffect, useState } from 'react';

import Input from '../../components/common/Input';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';


import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { addMaterialName, editParicularMaterialData, getparticulrMaterialdata } from '../../services/allService';
const AddEditMaterialName = () => {
        const navigate=useNavigate()
    const { id } = useParams();
    console.log(id)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type:""
    });
    console.log("formData",formData)

    const handleValueChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fetcchpartivulruserdata = async () => {
        if (!id) return;

        try {
            const response = await getparticulrMaterialdata(id);
            if (response.status === 200) {
                const data = response.data;

              
            

                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    type:data.type || ""
               
                });
            }
        } catch (error) {
            console.error("Error fetching material:", error);
        }
    };

    useEffect(() => {
        fetcchpartivulruserdata();
    }, [id]);


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        let response;
        if (id) {
            response = await editParicularMaterialData(id, formData);
            if (response.status === 200) {
                
                toast.success("Updated successfully");
                   setTimeout(()=>{
navigate("/dashboard/materialdata")
      },2000)

            }
        } else {
            response = await addMaterialName(formData);
            if (response.status === 201) {
                toast.success("Added successfully");
                                   setTimeout(()=>{
navigate("/dashboard/materialdata")
      },2000)
            }
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Operation failed");
    }
};
const handedropchnage=(e)=>{
    const selected=e.target.value;
    console.log("selected",selected);
  setFormData(prev => ({
            ...prev,
            "type": selected
        }));
}





    return (
        <div className="container mt-4">
            <Card>
                <Card.Header>
                    <h4 className="mb-0">{id ? "Edit Material Name" : " Add Material Name"}</h4>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>


                        <Row className="mb-3">
                            <Col md={4}>
                                <Input
                                  required
                                    label="Material"
                                    type="text"
                                    placeholder="Enter Material name"
                                    value={formData.name}
                                    onChange={(e) => handleValueChange("name", e.target.value)}
                                />
                            </Col>

                            <Col md={4}>
                                <Input
                                    label="Description"
                                    type="text"
                                    placeholder="Enter Description"
                                    value={formData.description}
                                    onChange={(e) => handleValueChange("description", e.target.value)}
                                />
                            </Col>
                             <Col md={4} >
                                 <Form.Group className="mb-4 position-relative">
                                   <Form.Label>Type</Form.Label>
                                <Form.Select aria-label="Default select example " onChange={(e)=>handedropchnage(e)} value={formData.type || ""}>
      <option>Select The Type</option>
      <option value="raw material">Raw Material</option>
      <option value="ready material">Ready Material</option>
    
    </Form.Select>
    </Form.Group>
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

export default AddEditMaterialName;

