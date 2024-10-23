// src/dashboard/Analytics.js
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Analytics = () => {
  const { user } = useContext(AuthContext); // Get user data from context

  useEffect(() => {
    console.log('Analytics component loaded'); // Check if this message appears in the console
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Page</h1>
      {user ? ( // Check if user data is available
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.email}!</h2>
          {/* You can display more user data here as needed */}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
      <p>This is the Analytics page. Display your analytics data here.</p>
    </div>
  );
};

export default Analytics;
