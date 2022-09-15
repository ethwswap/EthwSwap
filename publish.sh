#!/bin/bash
rm -rf pnpm-lock.yaml
git pull
pnpm install
pnpm run build
pm2 delete ETHW-Swap
yarn prd