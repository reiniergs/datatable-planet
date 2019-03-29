import getResizedState from './getResizedState'

export default function getTotalWidthsMetadata(params) {
    const {
        columns,
        columnsMetaData,
        minColumnWidth,
        maxColumnWidth,
    } = params;
    const initial = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: minColumnWidth,
        maxColumnWidth: maxColumnWidth,
    };

    return columns.reduce((prev, col, index) => {
        const currentColumnMetaData = columnsMetaData[index];
        if (col.fixedWidth) {
            prev.totalFixedWidth += col.fixedWidth;
            prev.totalFixedColumns += 1;
        } else if (getResizedState(currentColumnMetaData)) {
            prev.totalResizedWidth += currentColumnMetaData.columnWidth;
            prev.totalResizedColumns += 1;
        } else if (col.initialWidth) {
            prev.totalResizedWidth += col.initialWidth;
            prev.totalResizedColumns += 1;
        } else {
            prev.totalFlexibleColumns += 1;
        }
        return prev;
    }, initial);
}
