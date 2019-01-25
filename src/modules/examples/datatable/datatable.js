import { LightningElement, track } from 'lwc';
import fetchData from './fetchData';


const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class ExamplesDatatable extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track isLoading = false;
    @track enableInfiniteLoading = true;
    @track rowsLength = 0;

    async connectedCallback() {
        this.isLoading = true;
        const data = await fetchData({ amountOfRecords: 100 });
        this.data = data;
        this.isLoading = false;
        this.rowsLength = this.data.length;
    }

    async onLoadMore() {
        this.isLoading = true;
        this.enableInfiniteLoading = false;

        const data = await fetchData({ amountOfRecords: 100 });
        this.data = [...this.data, ...data];

        this.isLoading = false;
        this.enableInfiniteLoading = true;
        this.rowsLength = this.data.length;
    }
}
