#!/usr/bin/env bash

if [ -e /run/dbus/pid ]
then
  echo "Deleted /run/dbus/pid"
else
  echo "No /run/dbus/pid to delete"
fi

if [ -e /var/run/dbus/pid ]
then
  echo "Deleted /var/run/dbus/pid"
else
  echo "No /var/run/dbus/pid to delete"
fi

if [ -e /usr/share/dbus-1/system.conf ]
then
  echo "Deleted /usr/share/dbus-1/system.conf"
else
  echo "No /usr/share/dbus-1/system.conf to delete"
fi

#dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address &
service dbus start &
exec apache2-foreground