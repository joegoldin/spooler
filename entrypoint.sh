#!/bin/bash

# Start the backend server in the background
node backend/server.js &

# Run the frontend (we run the dev build to ensure env vars are up to date)
cd frontend && npm start

# Keep the container running
wait
