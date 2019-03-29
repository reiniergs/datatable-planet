import CellIterator from './cellIterator';

export default class RowIterator {
    constructor({ data = [], columns = [] }) {
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
            [Symbol.iterator]: () => new CellIterator({
                rowData,
                columns: this.columns,
            }),
        }
    }
}
