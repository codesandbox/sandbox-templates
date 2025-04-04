FROM nginx AS builder

RUN apt-get update
RUN apt-get install openssl
RUN openssl req -nodes -x509 -newkey rsa:4096 -keyout /etc/ssl/nginx.key -out /etc/ssl/nginx.crt -days 3650 -subj "/C=CA/ST=Ontario/L=Ottawa/O=CCCS/CN=assemblyline.local"

FROM nginx

ENV DOLLAR $
ENV FQDN localhost
ENV MAX_BODY_SIZE 100M
ENV FRONTEND_HOST al_frontend
ENV SOCKET_HOST al_socketio
ENV UI_HOST al_ui
ENV KIBANA_HOST kibana
ENV TEMPLATE full
ENV ACCESS_LOG off
ENV ERROR_LOG /dev/stderr
ENV ERROR_LEVEL notice
ENV READ_TIMEOUT 60s
ENV CONNECT_TIMEOUT 60s
ENV SEND_TIMEOUT 60s

COPY http_redirect.conf /etc/nginx/conf.d/
COPY full.template /opt/
COPY minimal.template /opt/

COPY --from=builder /etc/ssl/ /etc/ssl/

EXPOSE 443
EXPOSE 80

CMD /bin/bash -c "envsubst < /opt/$TEMPLATE.template > /etc/nginx/conf.d/default.conf && cat /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
