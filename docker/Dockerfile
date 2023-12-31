# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code from the host to the image filesystem.
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup the runtime environment
FROM node:18

WORKDIR /usr/src/app

# Copy the build from the previous stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Copy .env file for environment variables (if you have one)
COPY .env ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 8080

# Start the app
CMD [ "node", "dist/index.js" ]