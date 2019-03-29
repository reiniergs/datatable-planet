import HeadIterator from '../headIterator';

jest.mock('../../helpers/resizer/index', () => ({
    getWidthStyle(pixels) {
        return pixels > 0 ? `width: ${pixels}px` : '';
    }
}));

const columns = [
    {
        label: 'Name',
        fieldName: 'name',
        colKeyValue: 'name-text',
        minWidth: 10,
        maxWidth: 300,
        type: 'text',
    },
    {
        label: 'Email',
        fieldName: 'email',
        colKeyValue: 'email-text',
        minWidth: 10,
        maxWidth: 300,
        type: 'text',
    },
];

describe('HeadIterator', () => {
    it('should return the right data', () => {
        const Iterable = {
            [Symbol.iterator]: () => new HeadIterator({
                columns,
            }),
        };
        const iterator = Iterable[Symbol.iterator]();
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                colKeyValue: 'name-text',
                colIndex: 0,
                label: 'Name',
                tabIndex: -1,
                columnWidth: undefined,
                minWidth: 10,
                maxWidth: 300,
                style: '',
            },
        });
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                colKeyValue: 'email-text',
                colIndex: 1,
                label: 'Email',
                tabIndex: -1,
                columnWidth: undefined,
                minWidth: 10,
                maxWidth: 300,
                style: '',
            },
        });
    });
    it('should return the right data when meta data is passed', () => {
        const columnsMetaData = [
            { columnWidth: 45 },
            { columnWidth: 130},
        ];
        const Iterable = {
            [Symbol.iterator]: () => new HeadIterator({
                columns,
                columnsMetaData,
            }),
        };
        const iterator = Iterable[Symbol.iterator]();
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                colKeyValue: 'name-text',
                colIndex: 0,
                label: 'Name',
                tabIndex: -1,
                columnWidth: 45,
                minWidth: 10,
                maxWidth: 300,
                style: 'width: 45px',
            },
        });
        expect(iterator.next()).toEqual({
            done: false,
            value: {
                colKeyValue: 'email-text',
                colIndex: 1,
                label: 'Email',
                tabIndex: -1,
                columnWidth: 130,
                minWidth: 10,
                maxWidth: 300,
                style: 'width: 130px',
            },
        });
    });
});
