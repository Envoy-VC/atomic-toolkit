import Arweave from 'arweave';

const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;

export const defaultArweave = new ArweaveClass({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
});
