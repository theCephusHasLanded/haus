import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const result = await axios.get('http://localhost:8080/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRooms(result.data);
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.roomNumber} - {room.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
