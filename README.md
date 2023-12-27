# Atomic Toolkit

Atomic Toolkit is your streamlined path to building on Atomic Standards. Craft rock-solid, spec-compliant assets with ease, thanks to robust type safety.

## Key Features

1. **Robust Type Safety**: Ensure accurate asset creation and adherence to Arweave specifications.
2. **Clear and Concise SDK**: Get up and running quickly with a developer-friendly experience.
3. **Comprehensive Function Coverage**: Create, fetch, and manage a variety of atomic assets, collections, and more.

## Getting Started

### Installation

```bash
npm install atomic-toolkit
```

### Setup

Import the SDK:

```ts
import AtomicToolkit from 'atomic-toolkit';
```

## Initialize with Arweave Wallet or Irys SDK

Using Arweave Wallet

```ts
const key = JSON.parse(readFileSync('wallet.json').toString());

const toolkit = new AtomicToolkit({ key });
```

Using Irys:

```ts
import Irys from '@irys/sdk';

const irys = new Irys({
    url: 'https://node2.irys.xyz',
    token: 'matic',
    key: 'your-private-key',
});

await irys.ready();

const toolkit = new AtomicToolkit({ irys });
```

## Documentation

For a complete overview of available functions and usage examples, please refer to the official documentation: [https://atomictoolkit.mintlify.app](https://atomictoolkit.mintlify.app/introduction)

# Contributing

We welcome contributions! Check out our [contributing guide](./contrubuting.md) for more information

# Future Plans

We're actively working on expanding functionality. Stay tuned for:

-   Stamp Functions
-   Atomic Tweet Functions
-   UCM Marketplace Functions
-   UDL Functions

**Let's build the future of atomic assets together!**
