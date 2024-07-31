import React from 'react';
import { Container, Box, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import UserList from '../../components/Dashboard/UserList';
import RoomList from '../../components/Rooms/RoomList';
import PaymentList from '../../components/Payments/PaymentList';
import BookingsList from '../../components/Bookings/BookingList';

const DashboardPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Dashboard
        </Heading>
        <Box as="hr" borderColor="gray.200" my={6} />
      </Box>

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing={10}>
        <Box bg="white" boxShadow="md" p={6} borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>
            Users
          </Heading>
          <UserList />
        </Box>
        <Box bg="white" boxShadow="md" p={6} borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>
            Rooms
          </Heading>
          <RoomList />
        </Box>
        <Box bg="white" boxShadow="md" p={6} borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>
            Payments
          </Heading>
          <PaymentList />
        </Box>
        <Box bg="white" boxShadow="md" p={6} borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>
            Bookings
          </Heading>
          <BookingsList />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage;
