export function getWidthStyle(pixels) {
    return pixels > 0 ? `width: ${pixels}px` : '';
}

export function getColumnWidthFromDef(column, columnMetaData) {
    let resizedWidth;
    if (columnMetaData && columnMetaData.isResized) {
        resizedWidth = columnMetaData.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}

function getExpectedFlexibleColumnWidth(widthsMeta, totalTableWidth) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
        maxColumnWidth,
    } = widthsMeta;
    const totalFlexibleWidth = totalTableWidth - totalFixedWidth - totalResizedWidth;
    const avgFlexibleColumnWidth = Math.floor(totalFlexibleWidth / totalFlexibleColumns);
    const allowedSpace = Math.max(avgFlexibleColumnWidth, minColumnWidth);
    return Math.min(maxColumnWidth, allowedSpace);
}

function getMinExpectedTableWidth(widthsMeta) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
    } = widthsMeta;
    const minTotalFlexibleWidth = totalFlexibleColumns * minColumnWidth;
    return minTotalFlexibleWidth + totalFixedWidth + totalResizedWidth;
}

function hasNoFlexibleColumns(widthsMeta) {
    return widthsMeta.totalFlexibleColumns === 0;
}

function getExpectedTableWidth(domTableWidth, widthsMeta) {
    const minExpectedTableWidth = getMinExpectedTableWidth(widthsMeta);
    return hasNoFlexibleColumns(widthsMeta)
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, domTableWidth);
}

function getResizeState(columnMetaData) {
    return columnMetaData ? columnMetaData.isResized : false;
}

function getTotalWidthsMetadata(params) {
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
        } else if (getResizeState(currentColumnMetaData)) {
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

export function getColumnsMetaData(params) {
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
            isResized: getResizeState(currentColumnMetaData),
        };
    });
}
