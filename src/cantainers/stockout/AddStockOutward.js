// import React, { useEffect, useState } from 'react';
// import CustomDropdown from '../../components/common/CustumDropdoen';
// import Input from '../../components/common/Input';
// import { Button, Form, Card, Row, Col } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import { addstockoutward } from '../../services/allService';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const AddStockOutward = () => {
//     const navigate=useNavigate()
//   const [formData, setFormData] = useState({
//     material_Name: '',
//     quantity_used: '',
//     purpose: '',
//     date: '',
//   });


//     const materialdata=useSelector(state=>state.material.allmaterial);
//   const [materialdropdownm,setmatrialdropdown]=useState([])
//   useEffect(()=>{
// const material_Name_dropdown=materialdata.map((item,index)=>({
//   label:item.name,
//   value:item._id
// }))
// setmatrialdropdown(material_Name_dropdown)
//   },[materialdata])

//   const handleValueChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSelect = (value) => {
//     handleValueChange('material_Name', value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await addstockoutward(formData);
//       if (response.status === 201) {
//         toast.success("Stock Outward added successfully!");
   
//         setFormData({
//           material_Name: '',
//           quantity_used: '',
//           purpose: '',
//           date: '',
//         });
//                                      setTimeout(()=>{
// navigate("/dashboard/stock-outward")
//       },2000)
     
//       } else {
//         toast.error("Failed to add stock outward.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error("Something went wrong.");
//     }
//   };

//   return (
//     <div className="container mt-4 overflows">
//       <Card>
//         <Card.Header>
//           <h4 className="mb-0">Add Stock Outward</h4>
//         </Card.Header>
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <Form.Label>Material Name</Form.Label>
//                 <CustomDropdown
//                   RoleDropdownData={materialdropdownm}
//                   onChange={(e) => handleSelect(e.target.value)}
//                   value={formData.material_Name}
//                 />
//               </Col>

//               <Col md={4}>
//                 <Input
//                   label="Quantity Used"
//                   type="number"
//                   placeholder="Enter Quantity Used"
//                   value={formData.quantity_used}
//                   onChange={(e) => handleValueChange("quantity_used", e.target.value)}
//                 />
//               </Col>

//               <Col md={4}>
//                 <Input
//                   label="Date"
//                   type="date"
//                   placeholder="Select Date"
//                   value={formData.date}
//                   onChange={(e) => handleValueChange("date", e.target.value)}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <Input
//                   label="Purpose"
//                   type="text"
//                   placeholder="Enter Purpose"
//                   value={formData.purpose}
//                   onChange={(e) => handleValueChange("purpose", e.target.value)}
//                 />
//               </Col>
//             </Row>

//             <div className="text-end mt-4">
//               <Button variant="primary" type="submit">
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default AddStockOutward;
import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/common/CustumDropdoen';
import Input from '../../components/common/Input';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addstockoutward } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddStockOutward = () => {
  const navigate = useNavigate();

  // formData now holds an array of selected materials and a shared purpose
  const [formData, setFormData] = useState({
    materials: [], // [{ material_Id: '', quantity_used: '', date: '' }]
    purpose: '',
  });

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

      // Transform payload to match backend schema
      const payload = {
        material_Name: mat.material_Id, // rename to match schema
        quantity_used: Number(mat.quantity_used), // convert to number
        date: mat.date,
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

                  <Col md={2}>
                                 <div className='mb-4 position-relative'>
                    <Button variant="danger" onClick={() => handleRemoveMaterial(index)}>
                      Remove
                    </Button>
                    </div>
                  </Col>
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
