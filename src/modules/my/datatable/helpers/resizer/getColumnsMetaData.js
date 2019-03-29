import getTotalWidthsMetadata from './getTotalWidthsMetadata';
import getExpectedTableWidth from './getExpectedTableWidth';
import getExpectedFlexibleColumnWidth from './getExpectedFlexibleColumnWidth';
import getColumnWidthFromDef from './getColumnWidthFromDef';
import getResizedState from './getResizedState';

export default function getColumnsMetaData(params) {
    const {
        columns,
        columnsMetaData,
        domTableWidth,
        minColumnWidth,
        maxColumnWidth,
    } = params;
    const widthsMeta = getTotalWidthsMetadata({
        columns,
        columnsMetaData,
        minColumnWidth,
        maxColumnWidth,
    });
    const expectedTableWidth = getExpectedTableWidth(domTableWidth, widthsMeta);
    const expectedFlexibleColumnWidth = getExpectedFlexibleColumnWidth(
        widthsMeta,
        expectedTableWidth,
    );

    return columns.map((column, index) => {
        const currentColumnMetaData = columnsMetaData[index];
        return {
            columnWidth: getColumnWidthFromDef(column, currentColumnMetaData) || expectedFlexibleColumnWidth,
            isResized: getResizedState(currentColumnMetaData),
        };
    });
}
