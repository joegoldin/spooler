#!/bin/bash

# Start the backend server in the background
node backend/server.js &

# Serve the frontend build
# Assuming the build is served using a static server on port 3001
# You can use any static server of your choice
yes | npx serve -s frontend/spooler/build -l 3001

# Keep the container running
wait
