import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Button, Modal, Form ,Row,Col,Container} from "react-bootstrap";
import { getMaterialHistory, markplaceOrder } from "../../services/allService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";

const PlaceOrder = () => {
const navigate = useNavigate();
const [buttondisabled,setbuttondisabled]=useState(false)
  const { materialId } = useParams();
  const [material, setMaterial] = useState(null);
  const [history, setHistory] = useState([]);
  console.log("history",history)
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  console.log("selectedSupplier",selectedSupplier)
// State for form data
const [formData, setFormData] = useState({
  quantity: "",           // user input
  cost: "",               // user input
  gstNumber: "",          // user input
  remarks: "",            // user input
  supplierName: "",       // auto-fill
  supplierEmail: "",      // auto-fill
  supplierPhone: "",      // auto-fill
  billingAddress: "",     // auto-fill
  shippingAddress: "",    // auto-fill
  materialName: "",       // auto-fill
  materialType: "",       // auto-fill
});

// Handle change for user inputs only
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleInputChange = (filed,value) => {
  
  setFormData((prev) => ({
    ...prev,
    [filed]: value,
  }));
};

// Auto-fill fields when supplier or material is selected
useEffect(() => {
  if (selectedSupplier && material) {
    setFormData((prev) => ({
      ...prev,
      supplierName: selectedSupplier|| "",
  
      materialName: material.name || "",
      materialType: material.type || "",
    }));
  }
}, [selectedSupplier, material]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMaterialHistory(materialId);
        if (res.data.success) {
          setMaterial(res.data.material);
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error("Error fetching material history", err);
      }
    };
    fetchHistory();
  }, [materialId]);



  const handleSubmit = async () => {
    setbuttondisabled(true)
    try {
      const res = await markplaceOrder({
    materialId,
        ...formData,
      });

      if (res.data.success) {
        navigate("/dashboard")
        toast.success("Order placed and email sent!");
          setbuttondisabled(false)
        setShowModal(false);
        setFormData({ quantity: "", cost: "", gstNumber: "", remarks: "" });
      }
    } catch (err) {
         setbuttondisabled(false)
      toast.error("Error placing order");
      console.error(err);
    }
  };

  return (
        <Container className="mt-4">
    <Card >
   <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
     <h3 className="mb-0">Place Order for {material?.name}</h3>
          <p className="mb-0"><strong>Type:</strong> {material?.type}</p>
             <Button
  variant="info"
  onClick={() =>
    navigate("/dashboard/material-cost", {
      state: { materialName: material?.name },
    })
  }
>
  View Material Cost History
</Button>
        </Card.Header>
   <Card.Body>
      <h5 className="mt-4">Previous Purchase Supplier</h5>
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.supplier}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setSelectedSupplier(item.supplier);
                      setShowModal(true);
                    }}
                  >
                    Place Order
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No history found</td>
            </tr>
          )}
        </tbody>
      </Table>
      
      </Card.Body>
    </Card>

      {/* Modal for placing order */}
<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      Place Order to {selectedSupplier?.name}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Supplier Info */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Supplier Name <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control type="text" name="supplierName"  required   value={formData.supplierName}
              onChange={handleChange}  />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control type="email" name="supplierEmail" required  value={formData.supplierEmail}
              onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control type="text" name="supplierPhone" required   value={formData.supplierPhone}
              onChange={handleChange}  />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>GST Number <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="text"
              required
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
           
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Order Info */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Material Name <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control type="text"  value={material?.name || ""} readOnly />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Material Type <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control type="text" value={material?.type || ""} readOnly />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          
            <Input
    required
    label=" Quantity"
    type="number"
    name="quantity"
    placeholder="Quantity"
     value={formData.quantity}
 onChange={handleChange}
    unitInput
    unitValue={formData?.quantity_unit || ''}
    onUnitChange={(e) => handleInputChange( 'quantity_unit', e.target.value)}
  />
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Company Name <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Addresses */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Billing Address <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData?.billingAddress || ""}
          name="billingAddress"
            onChange={handleChange}
            required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Shipping Address <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData?.shippingAddress || ""}
         name="shippingAddress"
           onChange={handleChange}
           required

            />
          </Form.Group>
        </Col>
      </Row>

      {/* Remarks */}
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
           <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Person <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type="text"
              name="cost"
              value={formData.contactperson}
              onChange={handleChange}
              required
            />
          </Form.Group>
          </Col>
      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)} disabled={buttondisabled}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit} disabled={buttondisabled}>Submit & Send Email</Button>
  </Modal.Footer>
</Modal>




    </Container>
  );
};

export default PlaceOrder;
