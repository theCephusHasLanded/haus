import React from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';
import UserList from '../../components/Dashboard/UserList';
import RoomList from '../../components/Rooms/RoomList';
import PaymentList from '../../components/Payments/PaymentList';
import BookingsList from '../../components/Bookings/BookingList';
const DashboardPage = () => {
  return (
    <Container>
      <Box mt={4}>
        <Heading as="h1" size="xl" mb={4}>Dashboard</Heading>
        <UserList />
        <RoomList />
        <PaymentList />
        <BookingsList />
      </Box>
    </Container>
  );
};

export default DashboardPage;
