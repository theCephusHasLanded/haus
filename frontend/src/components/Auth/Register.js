import React, { useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Box, Container, Heading, FormControl, FormLabel, Input, Button, Alert, AlertIcon } from '@chakra-ui/react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(''); // New state for the code
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post('/register', { username, email, password, code });
      setError('');
      // Redirect to login or other page
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Container>
      <Box maxW="md" mx="auto" mt={8}>
        <Heading as="h2" mb={6}>Register</Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Admin Code</FormLabel> {/* New field for admin code */}
          <Input
            type="text"
            placeholder="Enter admin code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleRegister} width="full">Register</Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
