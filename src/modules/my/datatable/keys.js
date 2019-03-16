export function generateColKeyValue(columnMetadata, index) {
    const prefix = columnMetadata.fieldName || index;
    return `${prefix}-${columnMetadata.type}`;
}
