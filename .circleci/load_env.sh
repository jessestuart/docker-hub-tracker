#!/bin/sh

echo '
export GITHUB_REPO=jessestuart/ts-docker-hub
export IMAGE=ts-docker-hub
export REGISTRY=jessestuart
export VERSION=$(curl -s https://api.github.com/repos/jessestuart/ts-docker-hub/releases/latest | jq -r ".tag_name")
export DIR=`pwd`
export QEMU_VERSION="v4.0.0"
' >>$BASH_ENV

. $BASH_ENV
