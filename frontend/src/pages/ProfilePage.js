import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, Avatar, Spinner, useColorModeValue, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbars/UserNavbar';
import axiosInstance from '../utils/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUsername = localStorage.getItem('username');
        const response = await axiosInstance.get(`/current-user/${currentUsername}`);
        console.log('Response data:', response.data);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box>
      <Box bg={bgColor} py={10}>
        <Container maxW="container.xl">
          {user ? (
            <VStack spacing={10} align="stretch">
              <Flex direction="column" align="center">
                <Avatar
                  size="2xl"
                  name={user.Username}
                  src={`https://i.pravatar.cc/150?u=${user.Username}`}
                  mb={4}
                />
                <Heading as="h1" size="2xl">{user.FullName || user.Username}</Heading>
                <Text fontSize="lg" color="gray.500">@{user.Username}</Text>
                <Text fontSize="sm" color="gray.500">
                  Member since {new Date(user.CreatedAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Text>
                <Link as={RouterLink} to={`/profile/${user.ID}`} color="blue.500">
                  {user.Username} ({user.Email})
                </Link>
              </Flex>
              <Box>
                <Heading as="h2" size="lg" mb={4}>About Me</Heading>
                <Text>{user.Bio || 'No bio available'}</Text>
              </Box>
              <Box>
                <Heading as="h2" size="lg" mb={4}>Living Experiences</Heading>
                <Text>{user.LivingExperiences || 'No living experiences shared'}</Text>
              </Box>
              <Box>
                <Heading as="h2" size="lg" mb={4}>Community Interactions</Heading>
                <Text>{user.CommunityInteractions || 'No community interactions yet'}</Text>
              </Box>
              <Box>
                <Heading as="h2" size="lg" mb={4}>Role</Heading>
                <Text>{user.Role}</Text>
              </Box>
            </VStack>
          ) : (
            <Text>User not found</Text>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;
