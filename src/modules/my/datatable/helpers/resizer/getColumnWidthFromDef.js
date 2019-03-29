export default function getColumnWidthFromDef(column, columnMetaData) {
    let resizedWidth;
    if (columnMetaData && columnMetaData.isResized) {
        resizedWidth = columnMetaData.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}
