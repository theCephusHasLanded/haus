import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Heading, Text } from '@chakra-ui/react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Users</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {users.map(user => (
            <li key={user.ID}>{user.Username}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default UserList;
