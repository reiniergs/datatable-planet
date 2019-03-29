import CellIterator from '../cellIterator';

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Email', fieldName: 'email' },
];
const rowData = {
    name: 'John',
    email: 'john@gmail.com',
};

describe('CellIterator', () => {
    it('should return the right data', () => {
        const Iterable = {
            [Symbol.iterator]: () => new CellIterator({
                rowData,
                columns,
            }),
        };
        const iterator = Iterable[Symbol.iterator]();
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                field: 'John',
                columnLabel: 'Name',
                tabIndex: -1,
            },
        });
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                field: 'john@gmail.com',
                columnLabel: 'Email',
                tabIndex: -1,
            },
        });
        expect(iterator.next()).toEqual({
            done: true,
        });
    });
});
