import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/rooms')
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <h2>Themenräume</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.room_id}>
            <Link to={`/rooms/${room.room_id}`}>
              <h3>{room.name}</h3>
              <p>{room.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;