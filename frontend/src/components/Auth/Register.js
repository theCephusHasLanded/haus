import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, FormControl, FormLabel, Input, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/register', { username, email, password });
      setError('');
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error.includes('duplicate key value')) {
        setError('Username or email already exists');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <Container>
      <Box maxW="md" mx="auto" mt={8}>
        <h2>Register</h2>
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

        <Button colorScheme="blue" onClick={handleRegister} width="full">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
