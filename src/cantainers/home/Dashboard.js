import React, { useEffect, useState } from 'react';
import { dashboardstats, getallMaterialName } from '../../services/allService';
import {
  Table,
  Container,
  Pagination,
  Card,
  Form,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { storeallmaterial } from '../../redux/materilslice';
import DashboardData from './DashboardData';
import { ExportToExcel } from './ExportToExcel';
const Dashboard = () => {
  const fileName = "stockoutwad"; // here enter filename for your excel file
  const dispatch=useDispatch()
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);             // All data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
    const [exceldata, setexceldata] = useState([]);   
  console.log(filteredData)

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data from API
  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardstats();
      if (response.status === 200) {
        const formattedData = response.data.data.map((item) => ({
          material_Name: item.material_name,
          total_stock_in: item.total_stock_in,
          total_stock_out: item.total_stock_out,
          current_stock: item.current_stock,
        }));
         const customHeadings =response.data.data.map((item) => ({
       "Material Name":item.material_name,
       "Total Stock In": item.total_stock_in,
           "Total Stock Out":  item.total_stock_out,
             "Current Stock":  item.current_stock,
     }))
setexceldata(customHeadings)
        setData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const fetchmaterialData = async () => {
    try {
      const response = await getallMaterialName();
      if (response.status === 200) {
        const data = response.data || [];
dispatch(storeallmaterial(data))
      }
    } catch (error) {
      console.error('Error fetching stock inward data:', error);
    }
  };

  useEffect(() => {
    fetchmaterialData();
  }, []);
  // Filter by search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = data.filter(item =>
      item.material_Name.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(result);
    setCurrentPage(1); // Reset page
  }, [search, data]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Auto Stock Calculator</h4>
        </Card.Header>

        <Card.Body>
          <div className='d-flex' style={{justifyContent:"space-between"}}>    
            <div>
            <Form.Control
          style={{width:"40vw"}}
            type="text"
            placeholder="Search material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          </div>
          {/* <div>
         <ExportToExcel apiData={exceldata} fileName={fileName} />
         </div> */}
         </div>
      
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Total Stock In</th>
                <th>Total Stock Out</th>
                <th>Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{item.material_Name}</td>
                    <td>{item.total_stock_in}</td>
                    <td>{item.total_stock_out}</td>
                    <td>{item.current_stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
