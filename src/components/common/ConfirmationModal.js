import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmationModal = ({show,handleClose,handleConfirm,modalbody}) => {
  return (
    <div> <Modal show={show} onHide={handleClose}>
    
        <Modal.Body>{modalbody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal></div>
  )
}

export default ConfirmationModal