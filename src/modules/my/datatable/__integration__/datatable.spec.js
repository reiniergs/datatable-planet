/* eslint-disable no-undef */
describe('datatable itests', () => {
    it('should', () => {
        browser.url(URL);
        $('lightning-button').click();
        const actualText = $('lightning-button').getText();
        const expectedText = 'Clicked!';
        expect(actualText).toBe(expectedText);
    });
});
