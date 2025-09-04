import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Button, Modal, Form ,Row,Col} from "react-bootstrap";
import { getMaterialHistory, markplaceOrder } from "../../services/allService";
import { toast } from "react-toastify";

const PlaceOrder = () => {
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
    try {
      const res = await markplaceOrder({
    materialId,
        ...formData,
      });

      if (res.data.success) {
        toast.success("Order placed and email sent!");
        setShowModal(false);
        setFormData({ quantity: "", cost: "", gstNumber: "", remarks: "" });
      }
    } catch (err) {
      toast.error("Error placing order");
      console.error(err);
    }
  };

  return (
    <Card className="m-4 p-4">
      <h3>Place Order for {material?.name}</h3>
      <p><b>Type:</b> {material?.type}</p>
      <p><b>Limit:</b> {material?.limit}</p>

      <h5>Previous Purchase History</h5>
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
              <td colSpan="8" className="text-center">No history found</td>
            </tr>
          )}
        </tbody>
      </Table>

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
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control type="text" name="supplierName"     value={formData.supplierName}
              onChange={handleChange}  />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="supplierEmail"   value={formData.supplierEmail}
              onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="supplierPhone"    value={formData.supplierPhone}
              onChange={handleChange}  />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>GST Number</Form.Label>
            <Form.Control
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Order Info */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Material Name</Form.Label>
            <Form.Control type="text" value={material?.name || ""} readOnly />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Material Type</Form.Label>
            <Form.Control type="text" value={material?.type || ""} readOnly />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Addresses */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Billing Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData?.billingAddress || ""}
          name="billingAddress"
            onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData?.shippingAddress || ""}
         name="shippingAddress"
           onChange={handleChange}

            />
          </Form.Group>
        </Col>
      </Row>

      {/* Remarks */}
      <Row>
        <Col md={12}>
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
      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Submit & Send Email</Button>
  </Modal.Footer>
</Modal>



    </Card>
  );
};

export default PlaceOrder;
