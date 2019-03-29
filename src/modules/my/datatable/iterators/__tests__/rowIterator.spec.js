import BodyIterator from '../rowIterator';

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Email', fieldName: 'email' },
];

describe('RowIterator', () => {
    it('should return the right data', () => {
        const data = [
            { name: 'John', email: 'john@gmail.com' },
            { name: 'Joseph', email: 'joseph@gmail.com' },
            { name: 'Michael', email: 'michael@gmail.com' },
        ];
        const Iterable = {
            [Symbol.iterator]: () => new BodyIterator({
                data,
                columns,
            }),
        };
        const iterator = Iterable[Symbol.iterator]();
        expect(iterator.next()).toEqual({
            done: false,
            value: expect.any(Object),
        });
        expect(iterator.next()).toEqual({
            done: false,
            value: expect.any(Object),
        });
        expect(iterator.next()).toEqual({
            done: false,
            value: expect.any(Object),
        });
        expect(iterator.next()).toEqual({
            done: true,
        });
    });
});
