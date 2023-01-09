#!/bin/bash

act \
    pull_request \
    --container-architecture linux/amd64 \
    -j main \
    --env AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
    --env AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
    --env AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN" \
    -s GITHUB_TOKEN="$GITHUB_TOKEN"