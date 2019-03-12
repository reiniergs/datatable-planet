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
    @api minColumnWidth = 50;
    @api maxColumnWidth = 1000;
    @track _columns;
    @track tableWidth;
    columnsWidth = [];

    set columns(value) {
        this._columns = Array.isArray(value) ? value : [];
    }

    @api
    get columns() {
        return this._columns;
    }

    get tableIterator() {
        return this.createTableIterator(this.data, this._columns);
    }

    get tableStyles() {
        return this.tableWidth ? `width: ${this.tableWidth}px` : undefined;
    }

    connectedCallback() {
        this.template.addEventListener(
            'resizecol',
            this.handleResizeColumn.bind(this)
        );
    }

    renderedCallback() {
        if (!this.tableWidth) {
            const initialTableWidth = this.template.querySelector('table').offsetWidth;
            this.tableWidth = initialTableWidth;
            const columnWidth = Math.round(initialTableWidth / this._columns.length);
            this._columns = this._columns.map(column => ({
                ...column,
                width: columnWidth,
                style: `width: ${columnWidth}px`,
            }));
            this.columnsWidth = this._columns.map((column) => column.width);
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

    handleResizeColumn(event) {
        event.stopPropagation();
        const { colIndex, widthDelta } = event.detail;
        if (widthDelta !== 0) {
            this.tableWidth = this.tableWidth + widthDelta;
            this._columns = this._columns.map((column, index) => {
                const isCurrentColumnResized = colIndex === index;
                if (isCurrentColumnResized) {
                    const newColumnWidth = column.width + widthDelta;
                    return {
                        ...column,
                        width: newColumnWidth,
                        style: `width: ${newColumnWidth}px`,
                    };
                }
                return column;
            });
            this.columnsWidth = this._columns.map((column) => column.width);
            this.fireOnResize();
        }
    }

    fireOnResize() {
        const event = new CustomEvent('resize', {
            detail: {
                columnWidths: this.columnsWidth,
            },
        });
        this.dispatchEvent(event);
    }
}
