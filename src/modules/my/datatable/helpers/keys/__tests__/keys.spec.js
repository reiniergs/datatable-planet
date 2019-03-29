import { generateColKeyValue } from '../index';

describe('keys helper', () => {
    describe('generateColKeyValue', () => {
        it('should return name-text', () => {
            const metadata = {
                fieldName: 'name',
                type: 'text',
            };
            expect(generateColKeyValue(metadata, 1)).toBe('name-text');
        });
        it('should return 2-url when there is not fieldName in metadata', () => {
            const metadata = {
                type: 'url',
            };
            expect(generateColKeyValue(metadata, 2)).toBe('2-url');
        });
    });
});
