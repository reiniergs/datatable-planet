import { getWidthStyle } from '../helpers/resizer/index';

export default class HeaderIterator {
    constructor({ columns = [], columnsMetaData = {} }) {
        this.columns = columns;
        this.columnsMetaData = columnsMetaData;
        this.index = 0;
    }

    next() {
        const { columns, index } = this;
        if (index < columns.length) {
            const result = {
                value: this.getValue(columns[index]),
                done: false,
            };
            this.index++;
            return result;
        }
        return { done: true };
    }

    getValue(column) {
        const { colKeyValue, label, minWidth, maxWidth } = column;
        const { index, columnsMetaData } = this;
        const currentColumn = columnsMetaData[index];
        const newWidth = currentColumn ? currentColumn.columnWidth : undefined;
        return {
            colKeyValue,
            colIndex: index,
            label,
            tabIndex: -1,
            columnWidth: newWidth,
            minWidth,
            maxWidth,
            style: getWidthStyle(newWidth),
        };
    }
}
