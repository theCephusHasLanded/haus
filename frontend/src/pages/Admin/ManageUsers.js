import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Text, Spinner, Avatar, Flex } from '@chakra-ui/react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data || []);
      } catch (err) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.post(`/admin/users/${userId}/delete`);
      setUsers(users.filter(user => user.ID !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const restoreUser = async (userId) => {
    try {
      await axiosInstance.post(`/admin/users/${userId}/restore`);
      setUsers(users.map(user => user.ID === userId ? { ...user, DeletedAt: null } : user));
    } catch (err) {
      setError('Failed to restore user');
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Manage Users
        </Heading>
        <Box as="hr" borderColor="gray.200" my={6} />
      </Box>

      {error && <Text color="red.500">{error}</Text>}

      <Box>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User ID</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr key={user.ID}>
                <Td>{user.ID}</Td>
                <Td>
                  <Flex alignItems="center">
                    <Avatar name={user.Username} src={`https://i.pravatar.cc/150?u=${user.Username}`} size="sm" />
                    <Text ml={2}>{user.Username}</Text>
                  </Flex>
                </Td>
                <Td>{user.Email}</Td>
                <Td>{user.Role}</Td>
                <Td>{user.DeletedAt ? 'Deleted' : 'Active'}</Td>
                <Td>
                  {user.DeletedAt ? (
                    <Button colorScheme="green" onClick={() => restoreUser(user.ID)}>
                      Restore
                    </Button>
                  ) : (
                    <Button colorScheme="red" onClick={() => deleteUser(user.ID)}>
                      Delete
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ManageUsers;
