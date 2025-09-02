import React, { useEffect, useState } from 'react';
import { getallstockoutwards } from '../../services/allService';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '../../services/apiRoutes';

const StockOutward = () => {
  const navigate = useNavigate();
  const [stockoutsData, setStockoutsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
    const [selectedmaterial,setselectedmaterial]=useState("")
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Fetch all stock outward data
  const fetchStockOutward = async () => {
    try {
      const response = await getallstockoutwards();
      if (response.status === 200) {
        setStockoutsData(response.data.stockOutwardEntries);
        setFilteredData(response.data.stockOutwardEntries);
      }
    } catch (error) {
      console.error('Error fetching stock outward data:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStockOutward();
  }, []);

  // Filter logic (search + date range)
  useEffect(() => {
    const lowercased = search.toLowerCase();

    const filtered = stockoutsData.filter((item) => {
          const seletedmaterialtype=selectedmaterial.toLowerCase();
      const nameMatch = item?.material_Name?.name.toLowerCase().includes(lowercased);
              const typeMatch = item?.material_Name?.type.toLowerCase().includes(seletedmaterialtype);
      const date = new Date(item.date);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);

      return nameMatch && dateMatch && typeMatch;
    });
   
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, startDate, endDate, stockoutsData,selectedmaterial]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddStockOutward = () => {
    navigate('/dashboard/add-stock-outward');
  };
  const handedropchnage=(e)=>{
    const selected=e.target.value;
    console.log("selected",selected);
setselectedmaterial(selected)
}

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="mb-0">Material Stock Outward</h4>
          <Button variant="outline-primary" size="sm" onClick={handleAddStockOutward}>
            Add Stock Outward
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Filter Inputs */}
          <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
            <Form.Control
              type="text"
              placeholder="Search material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
                  {/* <Form.Select aria-label="Default select example "       style={{ maxWidth: '300px' }} onChange={(e)=>handedropchnage(e)} >
                  <option>Select The Type</option>
                  <option value="raw material">Raw Material</option>
                  <option value="ready material">Ready Material</option>
                
                </Form.Select> */}

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="form-control"
              maxDate={new Date()}
            />

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="form-control"
              maxDate={new Date()}
            />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setStartDate(null);
                setEndDate(null);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Data Table */}
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Quantity Used</th>
                <th>Date</th>
                <th>Purpose</th>
                  <th>Invoice</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{item?.material_Name?.name || "N/A"}</td>
                    <td>{item?.quantity_used  || "N/A"}</td>
                    <td>{formatDate(item.date) || "N/A"}</td>
                    <td>{item?.purpose || 'N/A'}</td>
                   <td>
  {item?.file?.type?.startsWith('image/') ? (
    // Show small clickable image preview
    <a href={`${BASE_URL}${item.file.url}`}  target="_blank" rel="noreferrer">
      <img 
        src={`${BASE_URL}${item.file.url}`} 
        alt="preview" 
        style={{ width: '50px', height: 'auto', cursor: 'pointer' }} 
      />
    </a>
  ) : item?.file?.type === 'application/pdf' ? (
    // Show clickable PDF link
    <a href={`${BASE_URL}${item.file.url}`}  target="_blank" rel="noreferrer">
      📄 View PDF
    </a>
  ) : (
    // If no file or unknown type
    'N/A'
  )}
</td>

                    <td>{item.user?.name || 'N/A'}</td>
                  </tr>
                ))
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StockOutward;
