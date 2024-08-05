# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install supervisor
RUN apt-get update && apt-get install -y supervisor

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of the application code to the working directory
COPY . /app

# Build the Next.js application
# RUN npm run build

# Compile TypeScript files
RUN npx tsc

# Copy the supervisord.conf file to the container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the Next.js application and the worker using Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
