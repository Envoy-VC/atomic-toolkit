const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
            console.error(`Attempt ${attempts + 1} failed: ${error}`);
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
