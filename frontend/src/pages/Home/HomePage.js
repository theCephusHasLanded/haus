import React from 'react';
import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HomePage = () => {
  return (
    <Box>
      <Container maxW="container.xl" py={10}>
        <Heading as="h1" size="2xl" mb={4}>Welcome to HAUS</Heading>
        <Text fontSize="xl" mb={4}>
          The best place to find your next home. Whether you're looking for a place to stay or
          offering one, we've got you covered. Join our community and start your journey today!
        </Text>
        <Button colorScheme="blue" size="lg" href="/register">Get Started</Button>
      </Container>
    </Box>
  );
};

export default HomePage;
