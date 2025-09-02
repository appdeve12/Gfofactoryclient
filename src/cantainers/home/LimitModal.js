import React, { useEffect } from 'react'
import { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Input from '../../components/common/Input';
import { Button } from 'react-bootstrap';
const LimitModal = ({handleClose,handleConfirm,openModel,limitdata=null}) => {
    console.log("limitdata",limitdata)
    const [formData,setFormData]=useState({
        "limit":""
    })
    console.log(formData)
    const handlevalueChange=(field,value)=>{
        setFormData((prev)=>({...prev,[field]:value}))
    }
    useEffect(()=>{
         setFormData((prev)=>({...prev,limit:limitdata}))
    },[limitdata]);
    const handlefinalConfirm=()=>{
        handleConfirm(formData)
    }
  return (
    <div>      <Modal show={openModel} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
             <Input
              label="Enter New Limit"
              type="text"
              placeholder="Enter New Limit"
              value={formData.limit}
              onChange={(e) => handlevalueChange("limit", e.target.value)}
            />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlefinalConfirm}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
</div>
  )
}

export default LimitModal