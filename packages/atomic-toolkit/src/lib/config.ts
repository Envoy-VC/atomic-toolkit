import Arweave from 'arweave';
import { Warp, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arbundles';
import { TurboAuthenticatedClientInterface, TurboFactory, TurboUnauthenticatedClientInterface } from '@ardrive/turbo-sdk';

import * as Types from '../types';

const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;

/**
 * Default Arweave configuration.
 */
export const defaultArweave = new ArweaveClass({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
});

export const defaultTurbo = TurboFactory.unauthenticated()

export const getConfig = (
    opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
) => {
    let baseWarp: Warp;
    let baseArweave: Arweave;
    let baseIrys: WebIrys | Irys | null | undefined;
    let baseKey: JWKInterface | 'use_wallet' | null;
    let baseTurbo: TurboAuthenticatedClientInterface | TurboUnauthenticatedClientInterface;
    const { warp, ...props } = opts;

    if (warp) {
        if (!warp.hasPlugin('deploy') || warp.environment === 'local') {
            throw new Error(
                'Warp instance must have DeployPlugin and should not be on Local Environment',
            );
        }
        baseWarp = warp;
    } else {
        baseWarp = WarpFactory.forMainnet().use(new DeployPlugin());
    }

    if (typeof props === 'object' && 'irys' in props) {
        const { irys } = props as Types.AtomicToolkitWithIrys;
        baseIrys = irys;
        baseArweave = defaultArweave;
        baseKey = null;
        baseTurbo = defaultTurbo;
    } else if (typeof props === 'object' && 'turbo' in props) {
        const { turbo } = props as Types.AtomicToolkitWithTurbo;
        baseTurbo = turbo ?? defaultTurbo;
        baseArweave = defaultArweave;
        baseKey = null;
        baseIrys = null;
    } else {
        const { arweave, key } = props as
            | Types.AtomicToolkitWithArweave
            | Types.AtomicToolkitWebWithArweave;
        baseArweave = arweave ?? defaultArweave;
        baseKey = key ?? 'use_wallet';
        baseIrys = null;
        baseTurbo = defaultTurbo;
    }

    return {
        warp: baseWarp,
        arweave: baseArweave,
        irys: baseIrys,
        key: baseKey,
        turbo: baseTurbo,
    };
};
