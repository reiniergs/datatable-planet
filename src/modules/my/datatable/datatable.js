import { LightningElement, api, track } from 'lwc';
import mix from '../mixinBuilder/mixinBuilder';
import eventEmitter from './mixins/eventEmitter/eventEmitter';
import getIterator from './iterator';
import {
    updateColumnWidthsMetadata,
    getColumnsWidths,
    resetColumnWidths,
    hasDefinedColumnsWidths,
    adjustColumnsSize,
    resizeColumnWithDelta,
    getCustomerColumnWidths,
} from './resizer';
import {
    normalizeColumns,
    hasColumns,
} from './columns';

function setData(state, data) {
    if (Array.isArray(data)) {
        state.data = data;
    } else {
        state.data = [];
    }
}

export default class Datatable extends mix(LightningElement).with(eventEmitter) {
    @api minColumnWidth = 50;
    @api maxColumnWidth = 1000;

    @track state = {
        columns: [],
        columnWidths: [],
        resizeColumnDisabled: false,
        resizeStep: 10,
        columnWidths: [],
        tableWidth: 0,
        minColumnWidth: 50,
        maxColumnWidth: 1000,
    };

    set columns(value) {
        const columns = Array.isArray(value) ? value : [];
        this.updateColumns(columns);
    }

    @api
    get columns() {
        return this.state.columns;
    }

    set data(value) {
        setData(this.state, value);
    }

    @api
    get data() {
        return this.state.data;
    }

    get tableIterator() {
        return getIterator(this.data, this.columns);
    }

    get tableStyles() {
        const { tableWidth } = this.state;
        return tableWidth !== 0 ? `width: ${tableWidth}px` : undefined;
    }

    connectedCallback() {
        this.template.addEventListener(
            'resizecol',
            this.handleResizeColumn.bind(this)
        );
    }

    renderedCallback() {
        const { state } = this;
        if (hasColumns(state) && !hasDefinedColumnsWidths(state)) {
            adjustColumnsSize(this.template, state);
            this.fireOnResize();
        }
    }

    handleResizeColumn(event) {
        event.stopPropagation();
        const { colIndex, widthDelta } = event.detail;
        if (widthDelta !== 0) {
            resizeColumnWithDelta(this.state, colIndex, widthDelta);
            this.fireOnResize();
        }
    }

    updateColumns(columns) {
        const { state } = this;
        normalizeColumns(state, columns);
        updateColumnWidthsMetadata(state);

        if (state.columns.length !== getColumnsWidths(state).length) {
            resetColumnWidths(state);
        } else if (hasDefinedColumnsWidths(state)) {
            adjustColumnsSize(this.template, state);
        }
    }

    fireOnResize() {
        const event = new CustomEvent('resize', {
            detail: {
                columnWidths: getCustomerColumnWidths(this.state),
            },
        });
        this.dispatchEvent(event);
    }
}
