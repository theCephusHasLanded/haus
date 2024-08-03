import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text, Spinner, Avatar } from '@chakra-ui/react';

const UserBiosPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">User Bios</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {users.map(user => (
            <li key={user.ID}>
              <Box>
                <Avatar name={user.Username} src={user.AvatarURL} size="sm" />
                <Text>{user.Username}</Text>
                <Text>{user.FullName}</Text>
                <Text>{user.Bio}</Text>
              </Box>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default UserBiosPage;
