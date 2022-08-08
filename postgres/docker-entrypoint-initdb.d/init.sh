#!/bin/bash

chmod +x /backup.sh
 # every day at 10 a.m.
/usr/bin/crontab 0 10 * * * /backup.sh > /dev/null 2>&1

# start cron
/usr/sbin/crond -f -l 8
