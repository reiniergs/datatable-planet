class CellIterator {
    constructor(rowData, columns) {
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

export default class BodyIterator {
    constructor({ data, columns }) {
        this.data = data;
        this.columns = columns;
        this.rowIndex = 0;
    }

    next() {
        const { data, rowIndex } = this;
        if (rowIndex < data.length) {
            const result = {
                value: this.getValue(data[rowIndex]),
                done: false,
            };
            this.rowIndex++;
            return result;
        }
        return { done: true };
    }

    getValue(rowData) {
        return {
            [Symbol.iterator]: () => new CellIterator(rowData, this.columns),
        }
    }
}
