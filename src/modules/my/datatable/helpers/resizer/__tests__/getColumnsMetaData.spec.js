import getColumnsMetaData from '../getColumnsMetaData';

describe('resizer helper', () => {
    describe('getColumnsMetaData', () => {
        it('should return an empty array', () => {
            const params = {
                columns: [],
                columnsMetaData: [],
                domTableWidth: 600,
                minColumnWidth: 50,
                maxColumnWidth: 150,
            };
            expect(getColumnsMetaData(params)).toEqual([]);
        });
        it('should return the right columns meta data', () => {
            const params = {
                columns: [
                    { label: 'Name', fieldName: 'name' },
                    { label: 'Email', fieldName: 'email', type: 'email' },
                ],
                columnsMetaData: [],
                domTableWidth: 600,
                minColumnWidth: 50,
                maxColumnWidth: 1000,
            };
            expect(getColumnsMetaData(params)).toEqual([
                {
                    columnWidth: 300,
                    isResized: false,
                },
                {
                    columnWidth: 300,
 
                       isResized: false,
                },
            ]);
        });
        it('should return the right columns meta data when already have columnsMetaData', () => {
            const params = {
                columns: [
                    { label: 'Name', fieldName: 'name' },
                    { label: 'Email', fieldName: 'email', type: 'email' },
                ],
                columnsMetaData: [
                    { columnWidth: 35, isResized: true },
                    { columnWidth: 123, isResized: false },
                ],
                domTableWidth: 600,
                minColumnWidth: 50,
                maxColumnWidth: 1000,
            };
            expect(getColumnsMetaData(params)).toEqual([
                {
                    columnWidth: 35,
                    isResized: true,
                }, 
                {
                    columnWidth: 565,
                    isResized: false,
                },
            ]);
        });
        it('should return the right columns meta data when columns have fixedWidth or initialWidth', () => {
            const params = {
                columns: [
                    { label: 'Name', fieldName: 'name', fixedWidth: 60 },
                    { label: 'Email', fieldName: 'email', type: 'email', initialWidth: 120 },
                ],
                columnsMetaData: [
                    { columnWidth: 35, isResized: false },
                    { columnWidth: 123, isResized: false },
                ],
                domTableWidth: 600,
                minColumnWidth: 50,
                maxColumnWidth: 1000,
            };
            expect(getColumnsMetaData(params)).toEqual([
                {
                    columnWidth: 60,
                    isResized: false,
                }, 
                {
                    columnWidth: 120,
                    isResized: false,
                },
            ]);
        });
        it('should return the right columns meta data when columns have fixedWidth or initialWidth but are resized', () => {
            const params = {
                columns: [
                    { label: 'Name', fieldName: 'name', fixedWidth: 60 },
                    { label: 'Email', fieldName: 'email', type: 'email', initialWidth: 120 },
                ],
                columnsMetaData: [
                    { columnWidth: 35, isResized: true },
                    { columnWidth: 123, isResized: true },
                ],
                domTableWidth: 600,
                minColumnWidth: 50,
                maxColumnWidth: 1000,
            };
            expect(getColumnsMetaData(params)).toEqual([
                {
                    columnWidth: 60,
                    isResized: true,
                }, 
                {
                    columnWidth: 123,
                    isResized: true,
                },
            ]);
        });
    });
});
