function isCustomerColumn(column) {
    return column.internal !== true;
}

function getMinColumnWidth(state) {
    return state.minColumnWidth;
}

function getMaxColumnWidth(state) {
    return state.maxColumnWidth;
}

function getTotalWidthsMetadata(state) {
    const initial = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: state.minColumnWidth,
        maxColumnWidth: state.maxColumnWidth,
    };

    return state.columns.reduce((prev, col) => {
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

function getDomWidth(element) {
    return element.offsetWidth;
}

const CONTAINER_SEL = '.slds-scrollable_x';
function getAvailableWidthFromDom(root) {
    return getDomWidth(root.querySelector(CONTAINER_SEL));
}

function getWidthStyle(pixels) {
    return pixels > 0 ? `width:${pixels}px` : '';
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

function getFlexibleColumnWidth(widthsMeta, totalTableWidth) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
        maxColumnWidth,
    } = widthsMeta;
    const totalFlexibleWidth =
        totalTableWidth - totalFixedWidth - totalResizedWidth;
    const avgFlexibleColumnWidth = Math.floor(totalFlexibleWidth / totalFlexibleColumns);
    const allowedSpace = Math.max(avgFlexibleColumnWidth, minColumnWidth);
    return Math.min(maxColumnWidth, allowedSpace);
}

function getColumnWidthFromDef(column) {
    let resizedWidth;
    if (column.isResized) {
        resizedWidth = column.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}

function setTableWidth(state, tableWidth) {
    state.tableWidth = tableWidth;
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function getTableWidth(state) {
    return state.tableWidth;
}

export function getColumnsWidths(state) {
    return state.columnWidths;
}

export function updateColumnWidth(state, colIndex, newWidth) {
    const columnsWidths = getColumnsWidths(state);
    columnsWidths[colIndex] = newWidth;

    const column = state.columns[colIndex];
    column.columnWidth = newWidth;
    column.style = getWidthStyle(newWidth);
}

function resizeColumn(state, colIndex, width) {
    const column = state.columns[colIndex];
    const columnsWidths = getColumnsWidths(state);
    const currentWidth = columnsWidths[colIndex];
    const { minWidth, maxWidth } = column;

    const newWidth = clamp(width, minWidth, maxWidth);
    if (currentWidth !== newWidth) {
        const newDelta = newWidth - currentWidth;
        setTableWidth(state, getTableWidth(state) + newDelta);
        updateColumnWidth(state, colIndex, newWidth);
        column.isResized = true;
    }
}

export function resetColumnWidths(state) {
    state.columnWidths = [];
}

export function hasDefinedColumnsWidths(state) {
    return state.columnWidths.length > 0;
}

export function adjustColumnsSize(root, state) {
    const widthsMeta = getTotalWidthsMetadata(state);
    const expectedTableWidth = getExpectedTableWidth(root, widthsMeta);

    const expectedFlexibleColumnWidth = getFlexibleColumnWidth(
        widthsMeta,
        expectedTableWidth,
    );
    let columnsWidthSum = 0;
    resetColumnWidths(state);
    state.columns.forEach((column, colIndex) => {
        const width =
            getColumnWidthFromDef(column) || expectedFlexibleColumnWidth;
        columnsWidthSum += width;
        updateColumnWidth(state, colIndex, width);
    });

    setTableWidth(state, Math.min(expectedTableWidth, columnsWidthSum));
}

export function updateColumnWidthsMetadata(state) {
    state.columns.forEach((col) => {
        if (!col.internal) {
            col.minWidth = getMinColumnWidth(state);
            col.maxWidth = getMaxColumnWidth(state);
        }

        if (col.initialWidth) {
            col.initialWidth = clamp(
                col.initialWidth,
                col.minWidth,
                col.maxWidth,
            );
        }
    });
}

export function resizeColumnWithDelta(state, colIndex, widthDelta) {
    const currentWidth = getColumnsWidths(state)[colIndex];
    resizeColumn(state, colIndex, currentWidth + widthDelta);
}

export function getCustomerColumnWidths(state) {
    const { columns } = state;
    return columns.reduce((prev, column, index) => {
        if (isCustomerColumn(column)) {
            prev.push(state.columnWidths[index]);
        }
        return prev;
    }, []);
}
