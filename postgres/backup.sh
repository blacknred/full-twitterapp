#!/bin/bash
set -e

pg_dumpall --username "$POSTGRES_USER" | gzip > db_backup.pgsql.gz