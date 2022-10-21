"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("./assertions");
function zip(collectionA, collectionB) {
    return collectionA.map((element, index) => [
        element,
        collectionB[index],
    ]);
}
class DataTable {
    constructor(sourceTable) {
        if (sourceTable instanceof Array) {
            this.rawTable = sourceTable;
        }
        else {
            this.rawTable = (0, assertions_1.assertAndReturn)(sourceTable.rows, "Expected a PicleTable to have rows").map((row) => (0, assertions_1.assertAndReturn)(row.cells, "Expected a PicleTableRow to have cells").map((cell) => {
                const { value } = cell;
                (0, assertions_1.assert)(value != null, "Expected a PicleTableCell to have a value");
                return value;
            }));
        }
    }
    hashes() {
        const copy = this.raw();
        const keys = copy[0];
        const valuesArray = copy.slice(1);
        return valuesArray.map((values) => Object.fromEntries(zip(keys, values)));
    }
    raw() {
        return this.rawTable.slice(0);
    }
    rows() {
        const copy = this.raw();
        copy.shift();
        return copy;
    }
    rowsHash() {
        return Object.fromEntries(this.raw().map((values) => {
            const [first, second, ...rest] = values;
            if (first == null || second == null || rest.length !== 0) {
                throw new Error("rowsHash can only be called on a data table where all rows have exactly two columns");
            }
            return [first, second];
        }));
    }
    transpose() {
        const transposed = this.rawTable[0].map((x, i) => this.rawTable.map((y) => y[i]));
        return new DataTable(transposed);
    }
    toString() {
        return "[object DataTable]";
    }
}
exports.default = DataTable;
