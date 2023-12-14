import { ContractDeploy, Warp } from 'warp-contracts';
import Irys from '@irys/sdk';

// Helpers
import { buildTradableAssetTags } from './helpers';

// Types
import { AtomicToolkitOpts, CreateTradableAssetOpts } from './types';

class AtomicToolkit {
    protected warp: Warp;
    protected irys: Irys;

    constructor({ warp, irys }: AtomicToolkitOpts) {
        if (!warp.hasPlugin('deploy')) {
            throw new Error('Warp instance must have DeployPlugin');
        }
        this.warp = warp;
        this.irys = irys;
    }

    public async createAtomicAsset(
        pathToFile: string,
        opts: CreateTradableAssetOpts,
    ): Promise<ContractDeploy> {
        const tags = buildTradableAssetTags(pathToFile, opts);
        await this.irys.ready();
        const tx = await this.irys.uploadFile(pathToFile, {
            tags: tags,
        });
        const contract = this.warp.register(tx.id, this.getIrysNode());
        return contract;
    }

    public getIrysNode() {
        const url = this.irys.api.config.url.href;
        const node = url?.split('https://')[1]?.split('.irys.xyz')[0];
        if (node === 'devnet') {
            throw new Error('Only Node1 and Node2 are supported');
        }
        return node as 'node1' | 'node2';
    }
}

export default AtomicToolkit;
