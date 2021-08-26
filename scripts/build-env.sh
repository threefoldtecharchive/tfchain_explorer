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

configs="
window.configs = window.configs || {};
window.configs.gql_url = '$GQL_URL';
"

if [ -e $file ]
then
    rm $file
fi

echo $configs > $file
