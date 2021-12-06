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

PROXY_URL="https://gridproxy.dev.grid.tf"
case $GQL_URL in
  *"test"*)
    PROXY_URL="https://gridproxy.test.grid.tf"
    ;;
esac

configs="
window.configs = window.configs || {};
window.configs.gql_url = '$GQL_URL';
window.configs.proxy_url = '$PROXY_URL';
"

if [ -e $file ]
then
    rm $file
fi

echo $configs > $file
