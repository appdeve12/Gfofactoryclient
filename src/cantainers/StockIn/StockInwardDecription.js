import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getparticulrstockinward, review, supervisiorappredrequest } from "../../services/allService";
import { Card, Container, Row, Col, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const StockInwardDescription = () => {
  const { id } = useParams();
  const userD=useSelector(state=>state.auth.userdata);
  const userRole=userD.user.role;
  console.log("user",userD.user.role)
  const particulrstockin=useSelector(state=>state.storein.storeone)
  const [material, setMaterial] = useState(null);

  const fetchStockInwardParticular = async () => {
    try {
      const response = await getparticulrstockinward(id);
      if (response.status === 200) {
        setMaterial(response.data.material);
      }
    } catch (error) {
      console.error("Fetch material error:", error);
    }
  };

  useEffect(() => {
    setMaterial(particulrstockin)
  }, [particulrstockin]);

  if (!material) {
    return (
      <Container className="mt-5 text-center">
        <h5>Loading Material Details...</h5>
      </Container>
    );
  }

   const reviewButton = async (item) => {
      console.log(item);
      try {
        const res=await review(item);
        if(res.status==200){
        const response = await supervisiorappredrequest(item);
        if (response.status == 200) {
          toast.success("request approved successfully");
        fetchStockInwardParticular()
        }}
      } catch (error) {
  
      }
    }

  return (
    <Container className="mt-4">
      <Card className="shadow-lg rounded-3">
         <Card.Header className="d-flex justify-content-between align-items-center">
    <h4 className="mb-0">Material Details</h4>
    {/* Review Button */}
    {userRole=="supervisior" && (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        // Add your review click handler here
        reviewButton(material._id)
        console.log("Review button clicked for:", material._id);
      }}
    >
      Review
    </button>)}
  </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Material Name:</strong> {material.material_Name?.name}
            </Col>
            <Col md={6}>
              <strong>Type:</strong> {material.material_Name?.type}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Description:</strong> {material.material_Name?.description}
            </Col>
            <Col md={6}>
              <strong>Limit:</strong> {material.material_Name?.limit}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Purchase Quantity:</strong> {material.purchase_quantity}
            </Col>
            <Col md={6}>
              <strong>Purchase Date:</strong>{" "}
              {new Date(material.purchase_date).toLocaleDateString()}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Supplier:</strong> {material.supplier}
            </Col>
            <Col md={6}>
              <strong>Remarks:</strong> {material.remarks || "N/A"}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Status:</strong>{" "}
              <Badge bg={
                material.status === "done"
                  ? "success"
                  : material.status === "request-pending"
                  ? "warning"
                  : "secondary"
              }>
                {material.status}
              </Badge>
            </Col>
            <Col md={6}>
              <strong>Created By:</strong> {material.user?.name} (
              {material.user?.role})
            </Col>
          </Row>

          <h5 className="mt-4">Uploaded Files</h5>
          {material.file && material.file.length > 0 ? (
            <Table bordered hover responsive className="mt-2">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Type</th>
                  <th>Preview / Download</th>
                </tr>
              </thead>
              <tbody>
                {material.file.map((f, index) => (
                  <tr key={f._id}>
                    <td>{index + 1}</td>
                    <td>{f.type}</td>
                    <td>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No files uploaded.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StockInwardDescription;
