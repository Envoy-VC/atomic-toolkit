import { graphql } from '../../../generated';

export const GetCollection = graphql(`
    query GetCollection($collectionId: ID!) {
        transaction(id: $collectionId) {
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
