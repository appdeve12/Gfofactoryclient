import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { dashboardstats } from '../../services/allService';
import { Table, Button, Container, Row, Col, Pagination, Card } from 'react-bootstrap';
const Dashboard = () => {
  const [dashboardstat,setdashboardstats]=useState([]);
  const [parsedata,setparsdata]=useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [seleteddeleetdid,setseleteddeleetdid]=useState("")
    const rowsPerPage = 5;
  const fetchdashboardstats=async()=>{
    try{
const response=await dashboardstats();
if(response.status==200){
console.log(response.data)
setdashboardstats(response.data.data);
parseddata(response.data.data)
}
    }catch(error){

    }
  }
  const parseddata=(data)=>{
    const parsed=data.map((item)=>({
      material_Name:item.material_Name,
      total_stock_in:item.total_stock_in,
      total_stock_out:item.total_stock_out,
      current_stock:item.current_stock
    }))
    setparsdata(parsed)
  }
  useEffect(()=>{
fetchdashboardstats()
  },[])
    const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = parsedata.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(parsedata.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Auto Stock Calculator</h4>
         
        </Card.Header>

        <Card.Body>
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Total Stock In</th>
                <th> Total Stock Out</th>
                <th>Current Stock</th>
              
        
         
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
                    <td>{item.total_stock_in}</td>
                          <td>{item.total_stock_out}</td>
                                <td>{item.current_stock}</td>
                  
                       
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

export default Dashboard