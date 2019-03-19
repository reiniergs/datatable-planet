import { LightningElement, api } from 'lwc';
import mix from 'my/mixinBuilder';
import eventEmitter, { emit } from './mixins/eventEmitter/index';
import table from './mixins/table/index';
import { normalizeColumns } from './columns';

function normalizeData(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

const privateData = Symbol('privateData');
const privateColumns = Symbol('privateColumns');
const privateHasDefinedColumns = Symbol('privateHasDefinedColumns');

export default class Datatable extends mix(LightningElement)
    .with(eventEmitter, table) {

        [privateData] = [];
        [privateColumns] = [];
        [privateHasDefinedColumns] = false;

        @api minColumnWidth = 50;
        @api maxColumnWidth = 1000;

        @api set data(value) {
            const data = normalizeData(value);
            const columns = this[privateColumns];
            this[privateData] = data;
            this[emit]('DATA_CHANGED', { data, columns });
        }

        get data() {
            return this[privateData];
        }

        @api set columns(value) {
            const columns = normalizeColumns(value);
            const data = this[privateData];
            this[privateColumns] = columns;
            this[emit]('COLUMNS_CHANGED', { data, columns });
        }

        get columns() {
            return this[privateColumns];
        }

        get tableStyles() {
            const { tableWidth } = this;
            return tableWidth !== 0 ? `width: ${tableWidth}px` : undefined;
        }

        renderedCallback() {
            const columns = this[privateColumns];
            const hasDefinedColumns = this[privateHasDefinedColumns];
            if (columns.length > 0 && !hasDefinedColumns) {
                const data = this[privateData];
                this[emit]('SET_COLUMNS_WIDTH', { columns, data });
                this[privateHasDefinedColumns] = true;
            }
        }
}
