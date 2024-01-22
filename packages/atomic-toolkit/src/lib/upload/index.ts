import { WebIrys } from '@irys/sdk';
import { TurboFileFactory, DataItemOptions } from '@ardrive/turbo-sdk';

import * as Types from '../../types/upload';
import Mime from 'mime';
import { Readable } from 'stream';

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

        // Upload Transaction
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

const uploadWithTurbo = async (opts: Types.TurboUploadParams) => {
    const { turbo, type, data, tags } = opts;

    {
        let fileStreamFactory;
        let fileSizeFactory;
        let dataItemOpts: DataItemOptions = {
            tags: tags.map((tag) => ({ name: tag.name, value: tag.value })),
        };

        if (data instanceof File) {
            // Browser environment, data is a File object
            fileStreamFactory = () => data.stream() as unknown as Readable;
            fileSizeFactory = () => data.size;
        } else if (type === 'data' && typeof data === 'string') {
            // Handling raw data as a string
            const buffer = Buffer.from(data);
            fileStreamFactory = () => Readable.from(buffer);
            fileSizeFactory = () => buffer.length;
        } else if (type === 'file' && typeof data === 'string') {
            // Node.js environment, data is assumed to be a file path
            const fs = require('fs');
            fileStreamFactory = () => fs.createReadStream(data);
            fileSizeFactory = () => fs.statSync(data).size;
        } else {
            throw new Error('Invalid type or data format');
        }

        const uploadParams: TurboFileFactory = {
            fileStreamFactory,
            fileSizeFactory,
            dataItemOpts,
        };

        try {
            // Perform file upload using Turbo SDK
            const tx = await turbo.uploadFile(uploadParams);
            return tx;
        } catch (error) {
            throw new Error(String(error));
        }
    }
};

export { uploadWithArweave, uploadWithIrys, uploadWithTurbo };
