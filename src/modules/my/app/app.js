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
        },
    },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DemoApp extends LightningElement {
    @track data = [];
    @track columns = columns;

    connectedCallback() {
        return fetchData({ amountOfRecords: 100 })
            .then((data) => {
                this.data = data;
            });
    }
}
