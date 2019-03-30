/* eslint-disable no-alert */
import { LightningElement, track } from 'lwc';
import fetchData from './fetchData';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { 
        label: 'Currency', 
        fieldName: 'currencyCode', 
        type: 'pickList',
        typeAttributes: {
            currencies: { fieldName: 'currencies' },
            rowId: { fieldName: 'id' },
        } 
    },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class ExamplesDatatable extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track isLoading = false;
    @track enableInfiniteLoading = true;
    @track rowsLength = 0;
    @track draftValues = []; 

    connectedCallback() {
        this.isLoading = true;

        return fetchData({ amountOfRecords: 100 })
            .then((data) => {
                this.data = data;
                this.isLoading = false;
                this.rowsLength = this.data.length;
            });
    }

    onLoadMore() {
        this.isLoading = true;
        this.enableInfiniteLoading = false;

        return fetchData({ amountOfRecords: 100 })
            .then((data) => {
                this.data = [...this.data, ...data];
                this.isLoading = false;
                this.enableInfiniteLoading = true;
                this.rowsLength = this.data.length;
            });
    }

    handleCurrencyChange(event)  {
        const { rowId, value } = event.detail;
        this.draftValues = [
            ...this.draftValues,
            { id: rowId, currencyCode: value },
        ];
    }

    handleOnCancel() {
        
        this.draftValues = [];
    }

    handleOnSave() {
        this.draftValues = [];
        alert('Go a save the changes in the server :) !!!');
    }
}
