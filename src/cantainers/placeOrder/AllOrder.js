import React, { useEffect, useState } from "react";
import { allorder } from "../../services/allService";
import {
  Table,
  Container,
  Form,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await allorder(); // your API call
      if (response.status === 200) {
        setOrders(response.data.orders || response.data); // adapt to your response format
        setFilteredOrders(response.data.orders || response.data);
        setError("");
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Search filter
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = orders.filter((order) =>
      order.materialName?.toLowerCase().includes(searchLower) ||
      order.supplierName?.toLowerCase().includes(searchLower) ||
      order.createdBy?.name?.toLowerCase().includes(searchLower)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [search, orders]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <h4 className="mb-3">All Orders</h4>

      {/* Search bar */}
      <Form.Control
        type="text"
        placeholder="Search by Material, Supplier or Creator..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: "350px", marginBottom: "15px" }}
      />

      {/* Error or Loading */}
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {/* Table */}
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Supplier</th>
                <th>Phone</th>
                <th>GST</th>
                <th>Billing Address</th>
                <th>Shipping Address</th>
                <th>Created By</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((order, index) => (
                  <tr key={order._id}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{order.materialName || "N/A"}</td>
                    <td>{order.materialType || "N/A"}</td>
                    <td>{order.quantity || "N/A"}</td>
                    <td>{order.cost || "N/A"}</td>
                    <td>{order.supplierName || "N/A"}</td>
                    <td>{order.supplierPhone || "N/A"}</td>
                    <td>{order.gstNumber || "N/A"}</td>
                    <td>{order.billingAddress || "N/A"}</td>
                    <td>{order.shippingAddress || "N/A"}</td>
                    <td>{order.createdBy?.name || "N/A"}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item
                  key={num + 1}
                  active={num + 1 === currentPage}
                  onClick={() => handlePageChange(num + 1)}
                >
                  {num + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default AllOrder;
