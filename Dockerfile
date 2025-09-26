# ---------- BASE IMAGE ----------  
FROM node:22-alpine

# ---------- SET WORING DIRECTORY ----------  
WORKDIR /app

# ---------- INSTALL DEPENDENCIES ----------  
COPY package*.json ./
RUN npm ci --only=production

# ---------- COPY SOURCE CODE ----------  
COPY . .

# ---------- INSTALL NETCAT ----------  
RUN apk add --no-cache netcat-openbsd

# ---------- ENVIRONMENT ----------  
ENV NODE_ENV=production
EXPOSE 5000

# ---------- BASE IMAGE ----------  
CMD [ "npm", "run", "dev" ]