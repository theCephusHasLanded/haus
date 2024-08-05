import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import Navbar from '../../components/Navbars/UserNavbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';

const HomePage = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box>
      <Box bg={bgColor} py={10}>
        <Container maxW="container.xl">
          <Heading as="h1" size="2xl" mb={4} textAlign="center">Welcome to HAUS</Heading>
          <Text fontSize="xl" mb={10} textAlign="center">
            The best place to find your next home. Whether you're looking for a place to stay or
            offering one, we've got you covered. Join our community and start your journey today!
          </Text>
          <Box textAlign="center" mb={10}>
            <Button colorScheme="blue" size="lg" href="/register">Get Started</Button>
          </Box>
          <VStack spacing={10} align="stretch">
            <AnimatedSection
              imageSrc="welcome.png"
              altText="Welcome to HAUS"
              heading="Discover Your Next Home"
              text="At HAUS, we understand the importance of finding the perfect place to call home. Our platform offers a variety of options to suit your needs, whether you're looking for a short-term rental or a long-term stay. Explore our listings and find your next home today."
              isImageFirst={true}
            />
            <AnimatedSection
              imageSrc="join.png"
              altText="Join Our Community"
              heading="Join Our Community"
              text="Being a part of the HAUS community means more than just finding a place to stay. Connect with like-minded individuals, share experiences, and create lasting memories. Our community is built on trust and mutual respect, ensuring a welcoming environment for everyone."
              isImageFirst={false}
            />
            <AnimatedSection
              imageSrc="flexible.png"
              altText="Flexible Options for Every Need"
              heading="Flexible Options for Every Need"
              text="Whether you're a digital nomad, a family on vacation, or someone looking for a fresh start, HAUS offers flexible rental options to fit your lifestyle. Our user-friendly platform makes it easy to browse, book, and manage your stay with just a few clicks."
              isImageFirst={true}
            />
            <AnimatedSection
              imageSrc="security.png"
              altText="Safety and Security"
              heading="Safety and Security"
              text="Your safety and security are our top priorities. HAUS provides verified listings, secure payment options, and 24/7 support to ensure a worry-free experience. Trust us to help you find a safe and comfortable place to stay."
              isImageFirst={false}
            />
            <AnimatedSection
              imageSrc="join.png"
              altText="Join Us Today"
              heading="Join Us Today"
              text="Ready to start your journey with HAUS? Join us today and discover the difference our platform can make in your search for the perfect home. Sign up now and become a part of our growing community."
              isImageFirst={true}
            />
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
