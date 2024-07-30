import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, FormControl, FormLabel, Input, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/'); // Redirect to the homepage after successful login
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleRegisterNavigation = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <Container>
      <Box maxW="md" mx="auto" mt={8}>
        <h2>Welcome HAUM</h2>
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
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleLogin} width="full" mb={4}>
          Login
        </Button>
        <Button colorScheme="teal" onClick={handleRegisterNavigation} width="full">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
