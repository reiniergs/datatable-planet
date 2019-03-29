import { generateColKeyValue } from '../keys/index';

function getColumnDefaults() {
    return {
        type: 'text',
    };
}

export function normalizeColumns(columns, minColumnWidth, maxColumnWidth) {
    if (Array.isArray(columns) && columns.length !== 0) {
        return columns.map((column, index) => {
            const normalizedColumn = {
                ...getColumnDefaults(),
                ...column,
            };
            return {
                ...normalizedColumn,
                colKeyValue: generateColKeyValue(normalizedColumn, index),
                minWidth: minColumnWidth,
                maxWidth: maxColumnWidth,
            };
        });
    }
    return [];
}
