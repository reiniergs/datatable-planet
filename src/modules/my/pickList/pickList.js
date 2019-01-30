import { LightningElement, api, track } from 'lwc';


export default class PickList extends LightningElement {
    
    @api rowId;
    @track privateValue;
    @track privateComputedCurrencies = [];

    privateCurrencies = [];

    @api set value(value) {
        this.privateValue = value;
        this.computeCurrenciesCollection();
    }

    get value() {
        return this.privateValue;
    }

    @api set currencies(value) {
        this.privateCurrencies = value;
        this.computeCurrenciesCollection();
    }

    get currencies() {
        return this.privateCurrencies;
    }

    computeCurrenciesCollection() {
        this.privateComputedCurrencies = this.privateCurrencies.map((name) => {
            return {
                name,
                isSelected: name === this.value,
            }
        });
    }

    handleOnChange(event) {
        const customEvent = new CustomEvent('currencychange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                rowId: this.rowId,
                value: event.target.value,
            }
        });
        this.dispatchEvent(customEvent);
    }
}