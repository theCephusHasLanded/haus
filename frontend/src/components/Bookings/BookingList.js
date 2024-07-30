import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const result = await axios.get('http://localhost:8080/bookings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookings(result.data);
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Booking List</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>{booking.userId} - {booking.roomId} - {booking.startDate} to {booking.endDate}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
