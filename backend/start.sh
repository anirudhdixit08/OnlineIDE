#!/bin/sh

echo "Starting jobQueue.js..."
node jobQueue.js &

echo "Starting index.js..."
node index.js

echo "Main process exited. Container will stop."