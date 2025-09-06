import React, { useEffect, useState } from "react";
import { Table, Container, Form, Pagination } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getorderplacedtomartivulrID } from "../../services/allService";

const OrderPlacedData = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [material, setMaterial] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // ✅ Fetch order data
  const fetchOrders = async () => {
    try {
      const response = await getorderplacedtomartivulrID(id);
      if (response.status === 200) {
        setOrders(response.data.orders || []);
        setMaterial(response.data.material || null);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  // ✅ Search filter
  const filteredOrders = orders.filter((order) =>
    order.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <h4 className="mb-3">
        Orders for Material: <strong>{material?.name || "N/A"}</strong>
      </h4>

      {/* 🔍 Search */}
      <Form.Control
        type="text"
        placeholder="Search by Supplier Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "15px" }}
      />

      {/* 📊 Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Supplier Name</th>
            <th>Quantity</th>
        
            <th>Ordered On</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((order, index) => (
              <tr key={order._id}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{order.supplierName || "N/A"}</td>
                <td>{order.quantity || "N/A"}{order.quantity_unit || "n/a"}</td>
   
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No orders found for this material.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 📄 Pagination */}
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
    </Container>
  );
};

export default OrderPlacedData;
