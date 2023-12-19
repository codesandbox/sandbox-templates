FROM denoland/deno:debian-1.35.0

RUN apt update && apt install -y unzip curl
RUN deno upgrade

RUN apt install -y nodejs npm
RUN npm install -g yarn
RUN yarn global add npm-check-updates