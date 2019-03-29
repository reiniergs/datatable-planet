export function normalizeData(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}
