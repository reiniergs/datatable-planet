import { LightningElement, track } from 'lwc';

export default class Datatable extends LightningElement {
    @track label = 'This is a test';

    handleClick() {
        this.label = 'Clicked!';
    }    
}
