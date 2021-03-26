FROM mhart/alpine-node:15.11

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY . /usr/src/app

LABEL type=optimuz

EXPOSE 3000
CMD ["node", "server.js"]
