# Base image.
FROM node:20.10-alpine3.18

# Create app directory.
WORKDIR /usr/src/app

# Copiamos archivos de dependencias
COPY package*.json ./

# PASO CLAVE 1: Instalamos TODAS las dependencias (incluyendo devDependencies)
# Esto es necesario porque el "build" necesita TypeScript y el CLI local.
RUN npm install

# Copiamos el resto del código
COPY . .

# PASO CLAVE 2: Usamos el CLI local de node_modules para compilar.
# Esto evita el error de "require() of ES Module".
RUN npm run build

# PASO CLAVE 3: Limpiamos las devDependencies después del build para que 
# la imagen final sea liviana, dejando solo lo necesario para producción.
RUN npm prune --production

# Establecemos el entorno a producción DESPUÉS del build
ENV NODE_ENV=production

# Expose port 8080.
EXPOSE 8080

# Start the server.
CMD [ "node", "dist/main.js" ]