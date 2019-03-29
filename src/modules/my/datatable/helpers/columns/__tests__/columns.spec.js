import { normalizeColumns } from '../index';

jest.mock('../../keys', () => ({
    generateColKeyValue: jest.fn(() => 'generated-key'),
}));

describe('columns helper', () => {
    describe('normalizeColumns', () => {
        it('should return an empty array when not an array is passed to normalizeColumns', () => {
            const values = [{}, 'abcd', 123, undefined, null];
            values.forEach(value => expect(normalizeColumns(value)).toEqual([]));
        });
        it('should return the columns normalized', () => {
            const columns = [
                { label: 'Name', fieldName: 'name' },
                { label: 'Email', fieldName: 'email', type: 'email' },
            ];
            expect(normalizeColumns(columns, 150, 500)).toEqual([
                {
                    label: 'Name',
                    fieldName: 'name',
                    type: 'text',
                    colKeyValue: 'generated-key',
                    minWidth: 150,
                    maxWidth: 500,
                },
                {
                    label: 'Email',
                    fieldName: 'email',
                    type: 'email',
                    colKeyValue: 'generated-key',
                    minWidth: 150,
                    maxWidth: 500,
                },
            ]);
        });
    });
});
