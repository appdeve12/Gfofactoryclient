import React, { useEffect, useState } from "react";
import { getMaterialDone } from "../../services/allService";
import { Table, Container, Form, Pagination } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const Materialcost = () => {
  const location = useLocation();
  const materialName = location.state?.materialName;
  console.log("materialName",materialName)

  const [materials, setMaterials] = useState([]);
  const [filterMaterials, setFilterMaterials] = useState([]);
  const [search, setSearch] = useState("");
  console.log(search)
  useEffect(()=>{
    if(materialName)
setSearch(materialName)
  },[materialName])
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch done materials
  const fetchOnlyDone = async () => {
    try {
      const response = await getMaterialDone();
      if (response.status === 200) {
        setMaterials(response.data.materials);
        setFilterMaterials(response.data.materials);
      }
    } catch (error) {
      console.error("Error fetching done materials:", error);
    }
  };

  useEffect(() => {
    fetchOnlyDone();
  }, []);

  // Search filter by Material Name or Supplier
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = materials.filter(
      (item) =>
        item.material_Name?.name.toLowerCase().includes(searchLower) ||
        (item.supplier?.toLowerCase().includes(searchLower))
    );
    setFilterMaterials(filtered);
    setCurrentPage(1);
  }, [search, materials]);

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filterMaterials.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filterMaterials.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <h4 className="mb-3">Done Materials</h4>

      {/* Search */}
      <Form.Control
        type="text"
        placeholder="Search by Material or Supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "15px" }}
      />

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Material Name</th>
            <th>Purchase Date</th>
            <th>Quantity</th>
               <th>Cost</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((item, index) => (
              <tr key={item._id}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{item.material_Name?.name || "N/A"}</td>
                <td>
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{item.purchase_quantity || "N/A"}{item.purchase_unit || "N/A"}</td>
                        <td>{item.cost || "N/A"}{item.cost_unit || "N/a"}</td>
                <td>{item.supplier || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No materials found.
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
    </Container>
  );
};

export default Materialcost;
