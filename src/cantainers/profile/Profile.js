import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Profile = () => {
      const userDt=useSelector(state=>state.auth.userdata)
  const [user, setUser] = useState({});

  useEffect(() => {
   
    if (userDt) {
      setUser(userDt.user);
    }
  }, [userDt]);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h4>User Profile</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
