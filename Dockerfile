# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all code
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the server
CMD ["npm", "run", "start:prod"]
