import { CodegenConfig } from '@graphql-codegen/cli';
import { maskTypename } from '@urql/core';

const config: CodegenConfig = {
    schema: 'https://arweave.net/graphql',
    documents: ['src/**/*.ts'],
    generates: {
        './generated/': {
            preset: 'client-preset',
            config: {
                strictScalars: true,
                maskTypename: true,
                useTypeImports: true,
            },
        },
    },
};

export default config;
