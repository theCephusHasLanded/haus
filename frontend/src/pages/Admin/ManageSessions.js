import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Text, Spinner } from '@chakra-ui/react';

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get('/admin/sessions');
        setSessions(response.data || []);
      } catch (err) {
        setError('Failed to fetch sessions');
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const invalidateSession = async (sessionId) => {
    try {
      await axiosInstance.post(`/admin/sessions/${sessionId}/invalidate`);
      setSessions(sessions.filter(session => session.ID !== sessionId));
    } catch (err) {
      setError('Failed to invalidate session');
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Manage Sessions
        </Heading>
        <Box as="hr" borderColor="gray.200" my={6} />
      </Box>

      {error && <Text color="red.500">{error}</Text>}

      <Box>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Session ID</Th>
              <Th>Username</Th>
              <Th>Last Active</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.map(session => (
              <Tr key={session.ID}>
                <Td>{session.ID}</Td>
                <Td>{session.Username}</Td>
                <Td>{session.LastActive}</Td>
                <Td>
                  <Button colorScheme="red" onClick={() => invalidateSession(session.ID)}>
                    Invalidate
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ManageSessions;
