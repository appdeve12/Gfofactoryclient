import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CommonConfirmationModal = ({ 
  show, 
  handleClose, 
  handleConfirm, 
  bodyText = "Are you sure?",   // 👈 Default text if not passed
  confirmButtonText = "Confirm", // Optional customization
  cancelButtonText = "Cancel" 
}) => {
  return (
    <Modal show={show}  centered>
      <Modal.Body>{bodyText}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {cancelButtonText}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommonConfirmationModal;
