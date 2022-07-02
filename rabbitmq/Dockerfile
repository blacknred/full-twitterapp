FROM rabbitmq:management-alpine

ENV RABBITMQ_PID_FILE /var/lib/rabbitmq/mnesia/rabbitmq

COPY ./plugins/rabbitmq_delayed_message_exchange-3.10.2.ez /opt/rabbitmq/plugins/
RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange rabbitmq_prometheus

ADD init.sh /init.sh
RUN chmod +x /init.sh

CMD ["/init.sh"]
