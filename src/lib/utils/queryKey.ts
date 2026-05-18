export const generateQueryString = (parameters: Record<string, string | number | boolean | undefined | null>): string => {
    const queryStringArray: string[] = [];
    for (const key in parameters) {
        const value = parameters[key];
        if (value !== undefined && value !== null && value !== '') {
            queryStringArray.push(`${key}=${encodeURIComponent(String(value))}`);
        }
    }
    return queryStringArray.join('&');
};
