# Use the official Node.js image as base
FROM node:18-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

RUN cp .env.sample .env

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
