import { track } from 'lwc';
import { subscribe } from '../eventEmitter/index';
import getIterator from '../../iterator'

export default function table(Base) {
    return class extends Base {
        @track tableIterator;

        constructor() {
            super();
            this[subscribe]('DATA_CHANGED', this.generateTableFromData.bind(this));
        }

        generateTableFromData({ data, columns }) {
            this.tableIterator = getIterator(data, columns)
        }
    }
}
