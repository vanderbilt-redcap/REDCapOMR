#!/usr/bin/env bash

set -e
set -x

compose_exec="docker"

if ! command -v "${compose_exec}" &> /dev/null; then
  echo "Unable to locate or docker."
  echo "Please follow the instructions present here: https://docs.docker.com/get-docker/"
  exit 1
fi

cmd_args=("compose")

build_args=("${cmd_args[@]}")
build_args+=(
  'build'
  '--build-arg'
   "UID=$(id -u)"
   '--build-arg'
   "GID=$(id -g)"
  'redcap-omr'
)

run_args=("${cmd_args[@]}")
run_args+=(
  'run'
  '--user'
  "$(id -u):$(id -g)"
  '-v'
  "${PWD}:/var/www/html/redcap-omr:z"
  '-p'
  '8080:80'
  'redcap-omr'
)

"${compose_exec[*]}" "${build_args[@]}"

exec "${compose_exec[@]}" "${run_args[@]}"