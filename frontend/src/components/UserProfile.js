import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, useColorModeValue, Spinner, Button, Textarea } from '@chakra-ui/react';
import Navbar from '../components/Navbars/UserNavbar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import axiosInstance from '../utils/axios';

const UserProfile = ({ match }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    livingExperiences: '',
    communityInteractions: '',
  });
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${match.params.id}`);
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName,
          bio: response.data.bio,
          livingExperiences: response.data.livingExperiences,
          communityInteractions: response.data.communityInteractions,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [match.params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/users/${match.params.id}`, formData);
      setUser({
        ...user,
        ...formData,
      });
      setEditing(false);
    } catch (error) {
      console.error('Failed to save user data', error);
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box>
      <Navbar />
      <Box bg={bgColor} py={10}>
        <Container maxW="container.xl">
          {user ? (
            <>
              <ProfileHeader user={user} />
              <VStack spacing={10} mt={10} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" mb={4}>About Me</Heading>
                  {editing ? (
                    <Textarea name="bio" value={formData.bio} onChange={handleInputChange} />
                  ) : (
                    <Text>{user.bio}</Text>
                  )}
                </Box>
                <Box>
                  <Heading as="h2" size="lg" mb={4}>Living Experiences</Heading>
                  {editing ? (
                    <Textarea name="livingExperiences" value={formData.livingExperiences} onChange={handleInputChange} />
                  ) : (
                    <Text>{user.livingExperiences}</Text>
                  )}
                </Box>
                <Box>
                  <Heading as="h2" size="lg" mb={4}>Community Interactions</Heading>
                  {editing ? (
                    <Textarea name="communityInteractions" value={formData.communityInteractions} onChange={handleInputChange} />
                  ) : (
                    <Text>{user.communityInteractions}</Text>
                  )}
                </Box>
                {editing ? (
                  <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                ) : (
                  <Button colorScheme="blue" onClick={() => setEditing(true)}>Edit</Button>
                )}
              </VStack>
            </>
          ) : (
            <Text>User not found</Text>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default UserProfile;
