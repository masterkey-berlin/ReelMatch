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

  if (loading) return <p className="text-center text-primary mt-10">Loading rooms...</p>;

  return (
    <div className="roomlist-container">
      <h2 className="roomlist-title">Entdecke Themenräume</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {rooms.map(room => (
          <Link to={`/rooms/${room.room_id}`} key={room.room_id} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>{room.name}</h3>
              <p className="text-muted">{room.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RoomList;