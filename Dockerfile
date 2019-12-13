FROM centos/nodejs-10-centos7
EXPOSE 3500

RUN mkdir -p /home/node/app
RUN chown node:node /home/node/app
USER node
COPY --chown=node:node ./build /home/node/app/build
COPY --chown=node:node ./node_modules /home/node/app/node_modules

WORKDIR /home/node/app

CMD ["node", "build/app.js"] 