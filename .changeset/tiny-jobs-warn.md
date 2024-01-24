---
'atomic-toolkit': minor
---

## Features

Integrate [Turbo](https://ardrive.io/turbo-bundler/), an open-source upload and payment service by ArDrive.

Turbo can be used in two ways:

1. Through Irys: Replace your node URL with `https://turbo.ardrive.io` or `up.arweave.net`
2. Through [Turbo SDK](https://github.com/ardriveapp/turbo-sdk).

Docs can be found [here](https://atomictoolkit.mintlify.app/usage/browser#using-turbo)

## Fixes

-   Fix `getUploadCost` method returning NaN for current balance for some irys endpoints.
