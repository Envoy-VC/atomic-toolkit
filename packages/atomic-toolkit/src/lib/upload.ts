import { WebIrys } from '@irys/sdk';
import * as Types from '../../types/upload';
import Mime from 'mime';

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
            } else if (type === 'file' && typeof data === 'string') {
                throw new Error('Invalid type' + type);
            } else {
                throw new Error('Invalid type ' + type);
            }
        } else {
            const { data, tags, type } = opts as Types.NodeIrysUploadParams;
            if (type === 'data' && typeof data === 'string') {
                tx = await irys.upload(data, {
                    tags: tags,
                });
            } else if (type === 'file') {
                tx = await irys.uploadFile(data, {
                    tags: tags,
                });
            } else {
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
        const { arweave, jwk, type, data, tags } = opts;
        let dataToUpload: string | ArrayBuffer;
        if (type === 'data' && typeof data === 'string') {
            dataToUpload = data;
        } else if (type === 'file' && data instanceof File) {
            dataToUpload = await data.arrayBuffer();
        } else if (type === 'file' && typeof data === 'string') {
            const { readFileSync } = require('fs');
            let buffer = readFileSync(data);
            let blob = new Blob([buffer]);
            const fileName = data.split('/').pop() ?? '';
            const type = Mime.getType(fileName) ?? 'application/octet-stream';
            let file = new File([blob], fileName, {
                type,
            });
            dataToUpload = await file.arrayBuffer();
        } else {
            throw new Error('Invalid Data as per ' + type);
        }

        const tx = await arweave.createTransaction(
            {
                data: dataToUpload,
            },
            jwk,
        );

        // Add Tags
        tags.forEach((tag) => tx.addTag(tag.name, tag.value));
        // Sign Tx
        await arweave.transactions.sign(tx, jwk);
        // Upload Tx
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
