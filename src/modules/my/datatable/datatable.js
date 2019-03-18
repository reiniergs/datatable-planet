import { LightningElement, api } from 'lwc';
import mix from 'my/mixinBuilder';
import eventEmitter, { emit } from './mixins/eventEmitter/index';
import table from './mixins/table/index';

function normalizeData(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

const privateData = Symbol('privateData');
const privateColumns = Symbol('privateColumns');

export default class Datatable extends mix(LightningElement)
    .with(eventEmitter, table) {

        [privateData] = [];
        [privateColumns] = [];

        @api set data(value) {
            const data = normalizeData(value);
            const columns = this[privateColumns];
            this[privateData] = data;
            if (columns.length) {
                this[emit]('DATA_CHANGED', { data, columns });
            }
        }

        get data() {
            return this[privateData];
        }

        @api set columns(value) {
            const columns = normalizeData(value);
            const data = this[privateData];
            this[privateColumns] = columns;
            if (data.length) {
                this[emit]('DATA_CHANGED', { data, columns });
            }
        }

        get columns() {
            return this[privateColumns];
        }
}
