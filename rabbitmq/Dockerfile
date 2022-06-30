FROM rabbitmq:3.8.22-management-alpine

ENV RABBITMQ_PID_FILE /var/lib/rabbitmq/mnesia/rabbitmq
RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange rabbitmq_prometheus

ADD init.sh /init.sh
RUN chmod +x /init.sh

CMD ["/init.sh"]
