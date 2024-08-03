import React from 'react';
import { Box, Container, Heading, Text, Button, Image, VStack, HStack, StackDivider, useColorModeValue } from '@chakra-ui/react';
import Navbar from '../../components/Navbars/UserNavbar';
import Footer from '../../components/Footer';

const HomePage = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Box>
      <Box bg={bgColor} py={10}>
        <Container maxW="container.xl">
          <Heading as="h1" size="2xl" mb={4} textAlign="center">Welcome HAUM!</Heading>
          <Text fontSize="xl" mb={10} textAlign="center">
            The best place to find your next home. Whether you're looking for a place to stay or
            offering one, we've got you covered. Join our community and start your journey today!
          </Text>
          <Box textAlign="center" mb={10}>
            <Button colorScheme="blue" size="lg" href="/register">Get Started</Button>
          </Box>
          <VStack
            divider={<StackDivider borderColor={useColorModeValue('gray.200', 'gray.700')} />}
            spacing={10}
            align="stretch"
          >
            <HStack spacing={10}>
              <Image boxSize="300px" src="https://via.placeholder.com/300.png?text=Welcome+to+HAUS" alt="Welcome to HAUS" />
              <Box>
                <Heading as="h2" size="lg" mb={4}>Discover Your Next Home</Heading>
                <Text fontSize="md">
                  At HAUS, we understand the importance of finding the perfect place to call home.
                  Our platform offers a variety of options to suit your needs, whether you're looking
                  for a short-term rental or a long-term stay. Explore our listings and find your
                  next home today.
                </Text>
              </Box>
            </HStack>
            <HStack spacing={10}>
              <Box>
                <Heading as="h2" size="lg" mb={4}>Join Our Community</Heading>
                <Text fontSize="md">
                  Being a part of the HAUS community means more than just finding a place to stay.
                  Connect with like-minded individuals, share experiences, and create lasting
                  memories. Our community is built on trust and mutual respect, ensuring a welcoming
                  environment for everyone.
                </Text>
              </Box>
              <Image boxSize="300px" src="https://via.placeholder.com/300.png?text=Join+Our+Community" alt="Join Our Community" />
            </HStack>
            <HStack spacing={10}>
              <Image boxSize="300px" src="https://via.placeholder.com/300.png?text=Flexible+Options" alt="Flexible Options" />
              <Box>
                <Heading as="h2" size="lg" mb={4}>Flexible Options for Every Need</Heading>
                <Text fontSize="md">
                  Whether you're a digital nomad, a family on vacation, or someone looking for a
                  fresh start, HAUS offers flexible rental options to fit your lifestyle. Our
                  user-friendly platform makes it easy to browse, book, and manage your stay with
                  just a few clicks.
                </Text>
              </Box>
            </HStack>
            <HStack spacing={10}>
              <Box>
                <Heading as="h2" size="lg" mb={4}>Safety and Security</Heading>
                <Text fontSize="md">
                  Your safety and security are our top priorities. HAUS provides verified listings,
                  secure payment options, and 24/7 support to ensure a worry-free experience. Trust
                  us to help you find a safe and comfortable place to stay.
                </Text>
              </Box>
              <Image boxSize="300px" src="https://via.placeholder.com/300.png?text=Safety+and+Security" alt="Safety and Security" />
            </HStack>
            <HStack spacing={10}>
              <Image boxSize="300px" src="https://via.placeholder.com/300.png?text=Join+Us+Today" alt="Join Us Today" />
              <Box>
                <Heading as="h2" size="lg" mb={4}>Join Us Today</Heading>
                <Text fontSize="md">
                  Ready to start your journey with HAUS? Join us today and discover the difference
                  our platform can make in your search for the perfect home. Sign up now and become
                  a part of our growing community.
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
