import React, { useEffect, useState } from 'react'
import { getallstockoutwards } from '../../services/allService'
import { Table, Button, Container, Row, Col, Pagination, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
const StockOutward = () => {const navigate=useNavigate()
  const [stockoutsdata,setstockoutsdata]=useState([])
    const [currentPage, setCurrentPage] = useState(1);
  
    const rowsPerPage = 5;
    const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = stockoutsdata.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stockoutsdata.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  const fetchstockoutward=async()=>{
    try{
const response=await getallstockoutwards();
if(response.status==200){
  console.log(response.data)
setstockoutsdata(response.data.stockOutwardEntries)
}
    }catch(error){

    }
  }
  useEffect(()=>{
fetchstockoutward()
  },[])
  const addstockopen=()=>{
navigate("/add-stock-outward")
}
  return (
    <>
      <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Material Stock Outward</h4>
          <Button variant="outline-primary" size="sm" onClick={()=>addstockopen()}>Add Stock Outward</Button>
        </Card.Header>

        <Card.Body>
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th> Quantity Used</th>
                <th> Date</th>
                <th>Purpose</th>
              
                <th>User</th>
         
              </tr>
            </thead>

            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No records found.</td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{item.material_Name}</td>
                    <td>{item.quantity_used}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.purpose || 'N/A'}</td>
              
                    <td>{item.user?.name || 'N/A'}</td>
                       
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination Controls */}
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
    </>
  )
}

export default StockOutward