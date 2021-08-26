#!/bin/sh

if [ ! -d dist ] 
then
    echo 'Error! cannot run this script before build.'
    exit 64
fi

if [ -z ${GQL_URL+x} ]
then
    echo 'Error! $GQL_URL is required.'
    exit 64
fi

echo $GQL_URL

configs="
window.configs = window.configs || {};
window.configs.gql_url = '$GQL_URL';
"

if [ -e dist/config.js ]
then
    rm dist/config.js
fi

echo $configs > dist/config.js
