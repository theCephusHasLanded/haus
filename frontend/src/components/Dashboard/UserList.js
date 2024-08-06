import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text, List, ListItem, Avatar, Flex } from '@chakra-ui/react';

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
        <List spacing={3}>
          {users.map(user => (
            <ListItem key={user.ID} bg="gray.50" p={3} borderRadius="md">
              <Flex alignItems="center">
                <Avatar name={user.Username} src={`https://i.pravatar.cc/150?u=${user.Username}`} size="sm" />
                <Text ml={4}>
                  <Link to={`/profile/${user.ID}`}>{user.Username} ({user.Email})</Link>
                </Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default UserList;
