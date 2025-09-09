import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const DeleteModal = ({handleClose,handleConfirm,show}) => {
  return (
    <>
    
      <Modal show={show} onHide={handleClose}>
     
        <Modal.Body>Are You Sure You Want To Delete!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal