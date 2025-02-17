# Use an official Node.js runtime as base
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 9797

# Start the application
CMD ["node", "Server.js"]
