# Use Node.js Alpine base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install dumb-init and all necessary compilers and runtimes
# The original image lacked these, causing the g++ not found error.
RUN apk update && \
    apk add --no-cache \
    dumb-init \
    build-base \
    python3 \
    g++ \
    gcc \
    openjdk17-jdk \
    && rm -rf /var/cache/apk/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Use dumb-init to handle PID 1 and signals
ENTRYPOINT ["dumb-init", "--"]

# Run both processes using a single npm script
CMD ["npm", "start"]
