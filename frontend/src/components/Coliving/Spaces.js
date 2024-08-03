import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text, Spinner } from '@chakra-ui/react';

const ColivingSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axiosInstance.get('/coliving/spaces');
        setSpaces(response.data);
      } catch (err) {
        setError('Failed to fetch coliving spaces');
      }
      setLoading(false);
    };

    fetchSpaces();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Coliving Spaces</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {spaces.map(space => (
            <li key={space.ID}>
              <Box>
                <Text>{space.Name}</Text>
                <Text>{space.Address}</Text>
                <Text>{space.Description}</Text>
              </Box>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default ColivingSpaces;
