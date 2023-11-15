# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the backend application
COPY ./backend/package*.json ./backend/
RUN npm install --prefix backend

# Copy the frontend application
COPY . .

# Install dependencies for frontend
RUN npm install --prefix frontend

# Expose ports for backend and frontend
EXPOSE 3000 3001

# Copy the entrypoint script and give execute permissions
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Set the entrypoint script to be executed
ENTRYPOINT ["./entrypoint.sh"]
