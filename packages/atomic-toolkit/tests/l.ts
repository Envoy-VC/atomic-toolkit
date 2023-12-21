import { WarpFactory } from 'warp-contracts';
import AtomicToolkit, { AtomicToolkitWeb } from '../src';

import Irys, { WebIrys } from '@irys/sdk';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const getWebIrys = async () => {
    await window.ethereum.enable();
    const provider = new providers.Web3Provider(window.ethereum);
    const url = 'https://node2.irys.xyz';
    const token = 'matic';
    // Devnet RPC URLs change often, use a recent one from https://chainlist.org/chain/80001
    const rpcURL = '';
    const wallet = { rpcUrl: rpcURL, name: 'ethersv5', provider: provider };
    const webIrys = new WebIrys({ url, token, wallet });
    await webIrys.ready();
    return webIrys;
};

const webIrys = await getWebIrys();

import Arweave from 'arweave';
import { JWKInterface } from 'arbundles';

const arweave = Arweave.init({});
const irys = new Irys({
    url: 'https://node2.irys.xyz',
    token: 'matic',
});

const toolkit = new AtomicToolkitWeb({
    warp: WarpFactory.forMainnet().use(new DeployPlugin()),
    irys: webIrys,
});

const t1 = new AtomicToolkit({
    irys: irys,
    warp: WarpFactory.forMainnet().use(new DeployPlugin()),
});
