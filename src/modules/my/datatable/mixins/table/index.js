import { track } from 'lwc';
import { subscribe } from '../eventEmitter/index';
import { getBodyIterator, getHeadIterator } from './iterators';
import { updateColumnsSize, updateTableWidth } from './utils';

export default function table(Base) {
    return class extends Base {
        @track headIterator;
        @track bodyIterator;
        @track tableWidth = 0;

        constructor() {
            super();
            this[subscribe]('DATA_CHANGED', this.generateTableFromData.bind(this));
            this[subscribe]('COLUMNS_CHANGED', this.generateTableFromColumns.bind(this));
            this[subscribe]('SET_COLUMNS_WIDTH', this.setColumnsWidth.bind(this))
        }

        setIterators(columns, data) {
            this.headIterator = getHeadIterator(columns);
            this.bodyIterator = getBodyIterator(data, columns);
        }

        generateTable(columns, data) {
            if (this.tableWidth === 0) {
                return this.setIterators(columns, data);
            }
            return this.setColumnsWidth({ columns, data });
        }

        generateTableFromColumns({ data, columns }) {
            this.generateTable(columns, data);
        }

        generateTableFromData({ data, columns }) {
            this.generateTable(columns, data);
        }

        setColumnsWidth({ columns, data }) {
            const updatedColumns = updateColumnsSize({
                root: this.template,
                columns,
                minColumnWidth: this.minColumnWidth,
                maxColumnWidth: this.maxColumnWidth,
            });
            this.tableWidth = updateTableWidth({
                root: this.template,
                columns: updatedColumns,
                minColumnWidth: this.minColumnWidth,
                maxColumnWidth: this.maxColumnWidth,
            });
            this.setIterators(updatedColumns, data);
        }
    }
}
