function getValue(rowIndex, data, columns) {
    let columnIndex = 0;
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    let cellResult;
                    if (columnIndex < columns.length) {
                        cellResult = {
                            value: {
                                field: data[rowIndex][columns[columnIndex].fieldName],
                                columnLabel: columns[columnIndex].label,
                            },
                            done: false,
                        };
                        columnIndex++;
                        return cellResult;
                    }
                    return { done: true };
                },
            };
        },
        ...data[rowIndex],
    };
}

export default function getIterator(data, columns) {
    let rowIndex = 0;
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    let result;
                    if (rowIndex < data.length) {
                        result = {
                            value: getValue(rowIndex, data, columns),
                            done: false,
                        };
                        rowIndex++;
                        return result;
                    }
                    return { done: true };
                },
            };
        },
    };
}
