#!/bin/sh

if [ -d dist ] 
then
    file="dist/config.js"
else
    file="config.js"
fi

if [ -z ${GQL_URL+x} ]
then
    echo 'Error! $GQL_URL is required.'
    exit 64
fi


POLKADOT_URL="wss://tfchain.dev.grid.tf/ws"

PROXY_URL="https://gridproxy.dev.grid.tf"
case $GQL_URL in
  *"test"*)
    PROXY_URL="https://gridproxy.test.grid.tf"
    POLKADOT_URL="wss://tfchain.test.grid.tf/ws"
    ;;
esac

configs="
window.configs = window.configs || {};
window.configs.gql_url = '$GQL_URL';
window.configs.proxy_url = '$PROXY_URL';
window.configs.polkadot_url = '$POLKADOT_URL';
window.configs.version = '$VERSION';
"

if [ -e $file ]
then
    rm $file
fi

echo $configs > $file
