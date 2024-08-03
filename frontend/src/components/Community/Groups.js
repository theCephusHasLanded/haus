import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text, Spinner } from '@chakra-ui/react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get('/community/groups');
        setGroups(response.data);
      } catch (err) {
        setError('Failed to fetch groups');
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Groups</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {groups.map(group => (
            <li key={group.ID}>{group.Name}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default Groups;
