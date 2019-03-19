function getWidthStyle(pixels) {
    return pixels > 0 ? `width: ${pixels}px` : '';
}

function updateColumnWidth(column, newWidth) {
    return {
        ...column,
        columnWidth: newWidth,
        style: getWidthStyle(newWidth),
    };
}

function getColumnWidthFromDef(column) {
    let resizedWidth;
    if (column.isResized) {
        resizedWidth = column.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}

function getFlexibleColumnWidth(widthsMeta, totalTableWidth) {
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

function getDomWidth(element) {
    return element.offsetWidth;
}

const CONTAINER_SEL = '.slds-scrollable_x';
function getAvailableWidthFromDom(root) {
    return getDomWidth(root.querySelector(CONTAINER_SEL));
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

function getExpectedTableWidth(root, widthsMeta) {
    const availableWidth = getAvailableWidthFromDom(root);
    const minExpectedTableWidth = getMinExpectedTableWidth(widthsMeta);
    return hasNoFlexibleColumns(widthsMeta)
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, availableWidth);
}

function getTotalWidthsMetadata(columns, minColumnWidth, maxColumnWidth) {
    const initial = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: minColumnWidth,
        maxColumnWidth: maxColumnWidth,
    };

    return columns.reduce((prev, col) => {
        if (col.fixedWidth) {
            prev.totalFixedWidth += col.fixedWidth;
            prev.totalFixedColumns += 1;
        } else if (col.isResized) {
            prev.totalResizedWidth += col.columnWidth;
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

export function adjustColumnsSize(params) {
    const { root, columns, minColumnWidth, maxColumnWidth } = params;
    const widthsMeta = getTotalWidthsMetadata(columns, minColumnWidth, maxColumnWidth);
    const expectedTableWidth = getExpectedTableWidth(root, widthsMeta);

    const expectedFlexibleColumnWidth = getFlexibleColumnWidth(
        widthsMeta,
        expectedTableWidth,
    );
    return columns.map((column) => {
        const width = getColumnWidthFromDef(column) || expectedFlexibleColumnWidth;
        return updateColumnWidth(column, width);
    });
}

export function updateTableWidth(columns) {
    let tableWidth = 0;
    columns.forEach((column) => {
        tableWidth += column.columnWidth;
    });
    return tableWidth;
}
