import Arweave from 'arweave';
import { Tag } from 'arbundles';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';

export type ArweaveUploadParams = {
    arweave: Arweave;
    jwk: JWKInterface | 'use_wallet';
    type: 'data' | 'file';
    data: string | File;
    tags: Tag[];
};

export type ArweaveDataUploadParams = {
    arweave: Arweave;
    jwk: JWKInterface | 'use_wallet';
    data: string;
    tags: Tag[];
};

export type NodeIrysUploadParams = {
    irys: Irys;
    type: 'data' | 'file';
    data: string;
    tags: Tag[];
};

export type WebIrysUploadParams = {
    irys: WebIrys;
    type: 'data' | 'file';
    data: string | File;
    tags: Tag[];
};

export type IrysUploadParams = NodeIrysUploadParams | WebIrysUploadParams;
