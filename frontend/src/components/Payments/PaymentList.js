import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const result = await axios.get('http://localhost:8080/payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPayments(result.data);
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Payment List</h2>
      <ul>
        {payments.map(payment => (
          <li key={payment.id}>{payment.bookingId} - {payment.amount} - {payment.paymentDate}</li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
