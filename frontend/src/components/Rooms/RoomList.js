import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text, Spinner } from '@chakra-ui/react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/rooms');
        setRooms(response.data);
      } catch (err) {
        setError('Failed to fetch rooms');
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Rooms</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {rooms.map(room => (
            <li key={room.ID}>
              <Box>
                <Text>{room.RoomNumber}</Text>
                <Text>{room.Description}</Text>
                <Text>${room.PricePerWeek}/week</Text>
              </Box>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default RoomList;
