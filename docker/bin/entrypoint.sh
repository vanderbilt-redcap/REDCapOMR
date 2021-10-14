#!/usr/bin/env bash

dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address &
exec apache2-foreground