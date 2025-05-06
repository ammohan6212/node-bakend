# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app source
COPY . .

# Expose the port your app runs on (adjust as needed)
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
