# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build app (for frontend)
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
