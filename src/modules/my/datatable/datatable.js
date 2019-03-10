import { LightningElement, api, track } from 'lwc';

function getValue(rowIndex, data, columns) {
    let columnIndex = 0;
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    let cellResult;
                    if (columnIndex < columns.length) {
                        cellResult = {
                            value: {
                                field: data[rowIndex][columns[columnIndex].fieldName],
                                columnLabel: columns[columnIndex].label,
                            },
                            done: false,
                        };
                        columnIndex++;
                        return cellResult;
                    }
                    return { done: true };
                },
            };
        },
        ...data[rowIndex],
    };
}

export default class Datatable extends LightningElement {
    @api data;
    @api columns;
    @track headerStyles;

    renderedCallback() {
        const { width } = this.template.querySelector('th').getBoundingClientRect();
        if (!this.headerStyles) {
            this.headerStyles = `width: ${width}px;`;
        }
    }

    createTableIterator(data, columns) {
        let rowIndex = 0;
        return {
            [Symbol.iterator]() {
                return {
                    next() {
                        let result;
                        if (rowIndex < data.length) {
                            result = {
                                value: getValue(rowIndex, data, columns),
                                done: false,
                            };
                            rowIndex++;
                            return result;
                        } 
                        return { done: true };
                    }
                };
            }
        };
    }

    get tableIterator() {
        return this.createTableIterator(this.data, this.columns);
    }
}
