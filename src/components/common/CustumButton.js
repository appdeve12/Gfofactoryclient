import React from 'react'
import { Button } from 'react-bootstrap'

const CustumButton = (props) => {
  return (
   <>     <Button variant="primary" type={props.type} onClick={props.onClick} className="w-100">
                  {props.name}
                </Button></>
  )
}

export default CustumButton