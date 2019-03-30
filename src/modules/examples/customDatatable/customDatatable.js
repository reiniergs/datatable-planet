import LightningDatatable from 'lightning/datatable';
import pickListTemplate from './pickList.html';

export default class CustomDatatable extends LightningDatatable {
    static customTypes = {
        pickList: {
            template: pickListTemplate,
            typeAttributes: ['currencies', 'rowId'],
        }
    } 
}