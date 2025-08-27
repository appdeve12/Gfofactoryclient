import React from 'react'
import useSelector from "react-redux"
const ProtectedRoute = () => {
  const userDt=useSelector(state=>state.auth.userdata);
  console.log(userDt.token);
 
  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute