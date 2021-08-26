# stage 1
FROM node:12.2.0-alpine as build

WORKDIR /app

# Copy vue app source code
COPY . /app/

# Install yarn and build project
RUN npm i -g yarn
RUN yarn cache clean 
RUN yarn install
RUN npm run build

# stage 2
FROM nginx:1.16.0-alpine

# Copy dist from stage(1) 
COPY --from=build /app /usr/share/nginx/html

# Add custom nginx conf
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf /etc/nginx/conf.d

# Serve the app
RUN chmod +x /usr/share/nginx/html/scripts/build-env.sh

EXPOSE 80
ENTRYPOINT [ "sh", "/usr/share/nginx/html/scripts/build-env.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]