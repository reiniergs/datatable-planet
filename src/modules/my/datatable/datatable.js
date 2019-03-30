/* eslint-disable lwc/valid-api */
import { LightningElement, api, track, unwrap } from 'lwc';
import { debounce } from 'lightning/inputUtils';
import HeadIterator from './iterators/headIterator'
import RowIterator from './iterators/rowIterator';
import { normalizeData } from './helpers/data/index'
import { normalizeColumns } from './helpers/columns/index';
import { getColumnsMetaData } from './helpers/resizer/index';
import { ResizeSensor } from './helpers/resizeSensor';

const CONTAINER_SELELECTOR = '.slds-scrollable_x';
const privateData = Symbol('privateData');
const privateColumns = Symbol('privateColumns');
const privateColumnsMetaData = Symbol('privateColumnsMetaData');
const privateIsFirstTimeWithColumns = Symbol('privateIsFirstTimeWithColumns');
const privateHasDetachedListeners = Symbol('privateHasDetachedListeners');
const privateWidthObserver = Symbol('privateWidthObserver');

export default class Datatable extends LightningElement {
    [privateData] = [];
    [privateColumns] = [];
    [privateColumnsMetaData] = [];
    [privateIsFirstTimeWithColumns] = true;
    [privateHasDetachedListeners] = true;

    @track headIterator = [];
    @track rowIterator = [];
    @track tableWidth = 0;

    @api minColumnWidth = 50;
    @api maxColumnWidth = 1000;

    @api set data(value) {
        const data = normalizeData(value);
        this[privateData] = data;
        return this.generateRowIterator();
    }

    get data() {
        return this[privateData];
    }

    @api set columns(value) {
        const columns = normalizeColumns(value, this.minColumnWidth, this.maxColumnWidth);
        this[privateColumns] = columns;
        return this.updateColumnsAndTableWidths();
    }

    get columns() {
        return this[privateColumns];
    }

    get tableInlineStyles() {
        const { tableWidth } = this;
        return tableWidth !== 0 ? `width: ${tableWidth}px` : undefined;
    }

    renderedCallback() {
        if (this[privateHasDetachedListeners]) {
            this.attachListeners();
        }
        const hasColumns = this.columns.length > 0;
        const isFirstTimeWithColumns = this[privateIsFirstTimeWithColumns];
        if (hasColumns && isFirstTimeWithColumns) {
            this.updateColumnsAndTableWidths();
            this[privateIsFirstTimeWithColumns] = false;
        }
    }

    disconnectedCallback() {
        this[privateHasDetachedListeners] = true;
        const resizeTarget = unwrap(
            this.template.querySelector('.dt-width-observer')
        );
        this[privateWidthObserver].detach(resizeTarget);
    }

    attachListeners() {
        const resizeTarget = unwrap(
            this.template.querySelector('.dt-width-observer')
        );
        this[privateWidthObserver] = new ResizeSensor(
            resizeTarget,
            debounce(() => {
                if (!this[privateHasDetachedListeners]) {
                    this.updateColumnsAndTableWidths();
                }
            }, 200)
        );
        this[privateHasDetachedListeners] = false;
    }

    updateColumnsAndTableWidths() {
        const {
            columns,
            minColumnWidth,
            maxColumnWidth,
        } = this;
        const domTableWidth = this.getTableWidthFromDom();
        const newColumnsMetaData = getColumnsMetaData({
            columns,
            columnsMetaData: this[privateColumnsMetaData],
            domTableWidth,
            minColumnWidth,
            maxColumnWidth,
        });
        this[privateColumnsMetaData] = newColumnsMetaData;
        if (this.hasFlexibleColumns()) {
            this.tableWidth = domTableWidth;
        }
        this.generateHeadIterator();
    }

    generateHeadIterator() {
        const columnsMetaData = this[privateColumnsMetaData];
        this.headIterator = {
            [Symbol.iterator]: () => new HeadIterator({
                columns: this.columns,
                columnsMetaData,
            }),
        };
    }

    generateRowIterator() {
        const { data, columns } = this;
        this.rowIterator = {
            [Symbol.iterator]: () => new RowIterator({
                data,
                columns,
            }),
        };
    }

    getTableWidthFromDom() {
        const tableContainer = this.template.querySelector(CONTAINER_SELELECTOR);
        if (tableContainer) {
            return tableContainer.offsetWidth;
        }
        return 0;
    }

    hasFlexibleColumns() {
        return this[privateColumnsMetaData].some(column => column.isResized === false);
    }

    handleResizeColumn(event) {
        event.stopPropagation();
        const { colIndex, widthDelta } = event.detail;
        if (widthDelta !== 0) {
            const columnsMetaData = this[privateColumnsMetaData];
            columnsMetaData[colIndex] = {
                columnWidth: columnsMetaData[colIndex].columnWidth + widthDelta,
                isResized: true,
            };
            this.generateHeadIterator();
            this.tableWidth = this.tableWidth + widthDelta;
        }
    }
}
