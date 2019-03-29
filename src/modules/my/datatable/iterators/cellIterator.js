export default class CellIterator {
    constructor({ rowData = {}, columns = [] }) {
        this.columns = columns;
        this.rowData = rowData;
        this.columnIndex = 0;
    }

    next() {
        const { columns, columnIndex } = this;
        if (columnIndex < columns.length) {
            const cellResult = {
                value: this.getValue(columns[columnIndex].fieldName),
                done: false,
            };
            this.columnIndex++;
            return cellResult;
        }
        return { done: true };
    }

    getValue(field) {
        const { rowData, columns, columnIndex } = this;
        return {
            field: rowData[field],
            columnLabel: columns[columnIndex].label,
            tabIndex: -1,
        };
    }
}
