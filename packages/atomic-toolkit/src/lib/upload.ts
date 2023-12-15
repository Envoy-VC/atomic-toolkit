import { WebIrys } from '@irys/sdk';
import * as Types from '../types/upload';
import fs from 'fs';

const uploadWithIrys = async (opts: Types.IrysUploadParams) => {
    const { irys } = opts;
    await irys.ready();
    let tx;
    try {
        if (irys instanceof WebIrys) {
            const { data, tags, type } = opts as Types.WebIrysUploadParams;
            if (type === 'data' && typeof data === 'string') {
                tx = await irys.upload(data, {
                    tags: tags,
                });
            } else if (type === 'file' && data instanceof File) {
                tx = await irys.uploadFile(data, {
                    tags: tags,
                });
            } else {
                // TODO: Folder Upload Coming Soon
                throw new Error('Invalid type ' + type);
            }
        } else {
            const { data, tags, type } = opts as Types.NodeIrysUploadParams;
            if (type === 'data') {
                tx = await irys.upload(data, {
                    tags: tags,
                });
            } else if (type === 'file') {
                tx = await irys.uploadFile(data, {
                    tags: tags,
                });
            } else {
                // TODO: Folder Upload Coming Soon
                throw new Error('Invalid type ' + type);
            }
        }
        return tx;
    } catch (error) {
        throw new Error(String(error));
    }
};

const uploadWithArweave = async (opts: Types.ArweaveUploadParams) => {
    try {
        const { data, arweave, jwk, tags, type } = opts;
        let dataToUpload: string | Uint8Array | ArrayBuffer;

        if (type === 'data' && typeof data === 'string') {
            dataToUpload = data;
        } else if (type === 'file') {
            if (data instanceof File) {
                dataToUpload = await data.arrayBuffer();
            } else {
                let buffer = fs.readFileSync(data);
                let blob = new Blob([buffer]);
                let fileName = data.split('/').pop() || '';
                let file = new File([blob], fileName, {
                    type: blob.type,
                });
                dataToUpload = await file.arrayBuffer();
            }
        } else {
            // TODO: Folder Upload Coming Soon
            throw new Error('Invalid type ' + type);
        }

        const tx = await arweave.createTransaction(
            {
                data: dataToUpload,
            },
            jwk,
        );
        tags.forEach((tag) => tx.addTag(tag.name, tag.value));
        await arweave.transactions.sign(tx, jwk);

        let uploader = await arweave.transactions.getUploader(tx);

        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            console.log(
                `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`,
            );
        }
        return tx;
    } catch (error) {
        throw new Error(String(error));
    }
};

export { uploadWithArweave, uploadWithIrys };
