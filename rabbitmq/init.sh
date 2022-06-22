#!/bin/sh

# Create Rabbitmq user
( rabbitmqctl wait --timeout 60 $RABBITMQ_PID_FILE ; \
rabbitmqctl add_user $RABBITMQ_USER $RABBITMQ_PASSWORD 2>/dev/null ; \
rabbitmqctl set_user_tags $RABBITMQ_USER administrator ; \
rabbitmqctl set_permissions -p / $RABBITMQ_USER  ".*" ".*" ".*" ; \
echo "*** User '$RABBITMQ_USER' with password '$RABBITMQ_PASSWORD' completed. ***" ; \
echo "*** Log in the WebUI at port 15672 (example: http:/localhost:15672) ***") &

# rabbitmqadmin declare exchange --vhost=taskapp name=some_exchange type=direct & \
# rabbitmqadmin declare queue --vhost=taskapp name=$RABBITMQ_QUEUE durable=true & \
# rabbitmqadmin --vhost=taskapp declare binding source="some_exchange" destination_type="queue" destination=$RABBITMQ_QUEUE routing_key="some_routing_key" ) & \

# $@ is used to pass arguments to the rabbitmq-server command.
# For example if you use it like this: docker run -d rabbitmq arg1 arg2,
# it will be as you run in the container rabbitmq-server arg1 arg2
rabbitmq-server $@


