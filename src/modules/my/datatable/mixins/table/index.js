import { track } from 'lwc';
import { subscribe } from '../eventEmitter/index';
import { getBodyIterator, getHeadIterator } from './iterators';
import { adjustColumnsSize, updateTableWidth } from './utils';

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

        generateTableFromColumns({ data, columns }) {
            this.headIterator = getHeadIterator(columns);
            this.bodyIterator = getBodyIterator(data, columns);
        }

        generateTableFromData({ data, columns }) {
            this.bodyIterator = getBodyIterator(data, columns);
        }

        setColumnsWidth({ columns, data }) {
            const resizedColumns = adjustColumnsSize({
                root: this.template,
                columns,
                minColumnWidth: this.minColumnWidth,
                maxColumnWidth: this.maxColumnWidth,
            });

            this.tableWidth = updateTableWidth(resizedColumns);
            this.headIterator = getHeadIterator(resizedColumns);
            this.bodyIterator = getBodyIterator(data, resizedColumns);
        }
    }
}
