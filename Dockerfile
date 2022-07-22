# Includes all of the instructions to set up the docker container 
# select the base image using the FROM statement
FROM node:lts-alpine

# name of the foler where the files will live
WORKDIR /app

# COPY files from the source folder '.' which is nasa-project
# into the '.' destination folder which is /app 
# COPY . .

# COPY package.json from the source folder '.' which is nasa-project
# into the '.' destination folder which is /app 
COPY package*.json ./

COPY client/package.json client/

# RUN commands to set up our project
# only install dependencies for production
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

# copy source code from the client
COPY client/ client/

# build frontend client 
RUN npm run build --prefix client


# copy source code from the server
COPY server/ server/
# for security reasons, set the user to "node" and not the root user 
USER node

# what to do when this docker container starts up 
# the command is 'npm,' the rest are parameters. Similar execvp() in C
CMD ["npm", "start", "--prefix", "server"]

# expose the port that the API is running on so that it is accessible 
# outside of the container 
EXPOSE 8000