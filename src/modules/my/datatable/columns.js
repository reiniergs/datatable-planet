import { generateColKeyValue } from './keys';

function getColumnDefaults() {
    return {
        type: 'text',
    };
}

export function hasColumns(state) {
    return state.columns.length > 0;
}

export function normalizeColumns(state, columns) {
    if (columns.length !== 0) {
        // workaround https://git.soma.salesforce.com/raptor/raptor/issues/763
        const normalizedColumns = Object.assign([], columns);

        state.columns = normalizedColumns.map((column, index) => {
            const normalizedColumn = Object.assign(
                getColumnDefaults(),
                column,
            );
            return Object.assign(normalizedColumn, {
                tabIndex: -1,
                colKeyValue: generateColKeyValue(normalizedColumn, index),
            });
        });
    } else {
        state.columns = [];
    }
}
