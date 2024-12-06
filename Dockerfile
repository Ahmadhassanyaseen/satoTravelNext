# Use the official Node.js image
FROM node:20

# Set environment to production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the default port used by Next.js
EXPOSE 3000


# Start the Next.js app in production mode
CMD ["npm", "start"]
