const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retries an asynchronous operation a specified number of times until it succeeds,
 * with a delay between each attempt.
 *
 * @template T - The type of the result returned by the operation.
 * @param {() => Promise<T>} operation - The asynchronous operation to be retried.
 * @param {number} maxAttempts - The maximum number of attempts to make.
 * @param {number} delayBetweenAttempts - The delay in milliseconds between each attempt.
 * @returns {Promise<T>} - A promise that resolves with the result of the operation if it succeeds.
 * @throws {Error} - If the operation fails after the maximum number of attempts.
 */
export const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxAttempts: number,
    delayBetweenAttempts: number,
): Promise<T> => {
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const result = await operation();
            return result; // Operation succeeded, return the result
        } catch (error) {
            console.log(`Attempt ${attempts + 1} to register failed`);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(
                    `Retrying in ${delayBetweenAttempts} milliseconds...`,
                );
                await delay(delayBetweenAttempts);
            }
        }
    }

    throw new Error(`Operation failed after ${maxAttempts} attempts`);
};
