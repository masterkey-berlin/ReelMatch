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
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-4xl font-bold mb-8 text-center text-primary">Entdecke Themenräume</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map(room => (
          <Link
            to={`/rooms/${room.id}`}
            key={room.id}
            className="block bg-background-light p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-2xl font-bold text-primary mb-2">{room.name}</h3>
            <p className="text-text-muted">{room.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RoomList;