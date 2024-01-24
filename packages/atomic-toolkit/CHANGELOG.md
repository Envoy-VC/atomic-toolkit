# atomic-toolkit

## 0.2.0

### Minor Changes

-   36d423b: ## Features

    Integrate [Turbo](https://ardrive.io/turbo-bundler/), an open-source upload and payment service by ArDrive.

    Turbo can be used in two ways:

    1. Through Irys: Replace your node URL with `https://turbo.ardrive.io` or `up.arweave.net`
    2. Through [Turbo SDK](https://github.com/ardriveapp/turbo-sdk).

    Docs can be found [here](https://atomictoolkit.mintlify.app/usage/browser#using-turbo)

    ## Fixes

    -   Fix `getUploadCost` method returning NaN for current balance for some irys endpoints.

## 0.1.1

### Patch Changes

-   34826a7: - Add: Core Atomic Asset Functions - Create Atomic Asset - Get Atomic Asset
    -   Add: Collection Functions
        -   Create Collection with Asset Ids
        -   Create Collection with Files
        -   Get Collection
    -   Add: GraphQL Function
        -   Expose GraphQL Client
    -   Add: Utility Functions
        -   Get Directory Size
        -   Get Upload Cost
        -   Upload Data
