#mvertes/alpine-mongo
#clutteredcode/mongo-alpine
#bitnami/mongodb
#deenoize/mongodb-backup-s3
#requilence/mongodb-backup
FROM alpine:3.9

RUN apk update &&\
    apk upgrade &&\
    apk add --no-cache mongodb &&\
    apk add --no-cache bash

ADD init.sh /init.sh
RUN chmod +x /init.sh
ADD auth.sh /auth.sh
RUN chmod +x /auth.sh

VOLUME /data/db

EXPOSE 27017 28017

ENTRYPOINT ["/init.sh"]