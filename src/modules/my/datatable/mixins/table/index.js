import { track } from 'lwc';
import { subscribe } from '../eventEmitter/index';
import { getBodyIterator, getHeadIterator } from '../../iterators'

export default function table(Base) {
    return class extends Base {
        @track headIterator;
        @track bodyIterator;

        constructor() {
            super();
            this[subscribe]('DATA_CHANGED', this.generateTableFromData.bind(this));
            this[subscribe]('COLUMNS_CHANGED', this.generateTableFromColumns.bind(this));
        }

        generateTableFromColumns({ data, columns }) {
            this.headIterator = getHeadIterator(columns);
            this.bodyIterator = getBodyIterator(data, columns);
        }

        generateTableFromData({ data, columns }) {
            this.bodyIterator = getBodyIterator(data, columns);
        }
    }
}
