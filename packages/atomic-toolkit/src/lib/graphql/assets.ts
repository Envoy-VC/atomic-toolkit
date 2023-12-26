import { graphql } from '../../../generated';

export const GetAtomicAsset = graphql(`
    query GetAtomicAsset($transactionId: ID!) {
        transaction(id: $transactionId) {
            id
            owner {
                address
                key
            }
            tags {
                name
                value
            }
        }
    }
`);
