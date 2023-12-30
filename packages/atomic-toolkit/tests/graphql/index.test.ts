import { describe, it } from 'vitest';

import { AtomicToolkitWeb } from '../../src';

const StampQuery = `
    query Stamps($txId: [String!]!, $cursor: String) {
        transactions(
            first: 100,
            tags: [
                { name: "Protocol-Name", values: ["Stamp"] }
                { name: "Data-Source", values: $txId }
            ]
            after: $cursor
        ) {
            pageInfo {
                hasNextPage
            }
            edges {
                cursor
                node {
                    owner {
                        address
                    }
                }
            }
        }
    }
`;

describe('Utilities', () => {
    it('should return cost to upload data using arweave', async () => {
        const toolkit = new AtomicToolkitWeb({});

        let variables = {
            txId: ['ADd6xeeWq_pYbu0m7ZlihV5CQkjOCKJIb9h7gWEDB6k'],
            cursor: null,
        };

        let allTxs: any[] = [];

        do {
            const res = await toolkit.gql.query(StampQuery, variables);
            allTxs = allTxs.concat(res.data.transactions.edges);
            const nextCursor = res.data.transactions.edges[
                res.data.transactions.edges.length - 1
            ]
                ? res.data.transactions.edges[
                      res.data.transactions.edges.length - 1
                  ].cursor
                : null;

            variables.cursor = nextCursor;
        } while (variables.cursor !== null);

        const owners = new Set(
            allTxs.map((tx) => tx.node.owner.address as string),
        );

        console.log(owners.size);
    });
});
