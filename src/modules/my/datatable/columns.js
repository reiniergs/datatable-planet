import { generateColKeyValue } from './keys';

function getColumnDefaults() {
    return {
        type: 'text',
    };
}

export function normalizeColumns(columns) {
    if (Array.isArray(columns) && columns.length !== 0) {
        // workaround https://git.soma.salesforce.com/raptor/raptor/issues/763
        const normalizedColumns = Object.assign([], columns);

        return normalizedColumns.map((column, index) => {
            const normalizedColumn = Object.assign(
                getColumnDefaults(),
                column,
            );
            return Object.assign(normalizedColumn, {
                tabIndex: -1,
                colKeyValue: generateColKeyValue(normalizedColumn, index),
            });
        });
    }
    return [];
}
