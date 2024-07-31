import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text } from '@chakra-ui/react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/rooms');
        setRooms(response.data);
      } catch (err) {
        setError('Failed to fetch rooms');
      }
    };

    fetchRooms();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Rooms</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {rooms.map(room => (
            <li key={room.ID}>{room.room_number}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default RoomList;
