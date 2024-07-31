import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Container, Box, Heading, Text } from '@chakra-ui/react';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get('/payments');
        setPayments(response.data);
      } catch (err) {
        setError('Failed to fetch payments');
      }
    };

    fetchPayments();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Heading as="h2" size="lg">Payments</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <ul>
          {payments.map(payment => (
            <li key={payment.ID}>${payment.Amount} - {payment.PaymentStatus}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default PaymentList;
