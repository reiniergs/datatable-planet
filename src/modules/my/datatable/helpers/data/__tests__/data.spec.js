import { normalizeData } from '../index';

describe('data helper', () => {
    describe('normalizeData', () => {
        it('should return an empty array when not an array is passed to normalizeData', () => {
            const values = [{}, 'abcd', 123, undefined, null];
            values.forEach(value => expect(normalizeData(value)).toEqual([]));
        });
        it('should return the same array passed', () => {
            const data = [{ name: 'John' }, { name: 'Doe' }];
            expect(normalizeData(data)).toEqual([{ name: 'John' }, { name: 'Doe' }]);
        });
    });
});
