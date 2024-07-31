import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text } from '@chakra-ui/react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
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
            <li key={user.ID}>{user.username}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default UserList;
