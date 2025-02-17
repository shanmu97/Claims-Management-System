# Use official Node.js image as base
FROM node:22

# Set the working directory for both backend and frontend
WORKDIR /app

# Copy and install dependencies for Backend
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install

# Copy and install dependencies for Frontend
COPY Frontend/package*.json ./Frontend/
RUN cd Frontend && npm install

# Copy both Backend and Frontend code into the container
COPY Backend ./Backend
COPY Frontend ./Frontend

# Build the Frontend (Vite)
RUN cd Frontend && npm run build

# Expose ports for both Backend and Frontend
EXPOSE 9797 5173

# Start both Backend and Frontend servers
CMD ["sh", "-c", "node /app/Backend/Server.js & npx serve /app/Frontend/dist --single"]
