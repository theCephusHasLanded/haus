import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text } from '@chakra-ui/react';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/bookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Bookings</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {bookings.map(booking => (
            <li key={booking.ID}>{`Booking ID: ${booking.ID}, Room ID: ${booking.room_id}, User ID: ${booking.user_id}, Status: ${booking.status}`}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default BookingsList;
