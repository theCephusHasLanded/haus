import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, VStack, Flex, useColorModeValue, Spinner } from '@chakra-ui/react';
import axiosInstance from '../../utils/axios';
import ProfileHeader from '../../components/ProfileHeader';

const UserBiosPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
        const currentUsername = localStorage.getItem('username');
        const currentUserData = response.data.find(user => user.username === currentUsername);
        setCurrentUser(currentUserData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box>
      <Box bg={bgColor} py={10}>
        <Container maxW="container.xl">
          <Heading as="h1" size="2xl" mb={4} textAlign="center">User Bios</Heading>
          <Flex>
            <Box flex="1" mr={5}>
              {currentUser && <ProfileHeader user={currentUser} />}
            </Box>
            <Box flex="2">
              <VStack spacing={4} align="stretch">
                {users.map(user => (
                  <Box key={user.ID} p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">
                      <Link to={`/profile/${user.ID}`}>{user.fullName}</Link>
                    </Heading>
                    <Text mt={4}>{user.bio}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default UserBiosPage;
