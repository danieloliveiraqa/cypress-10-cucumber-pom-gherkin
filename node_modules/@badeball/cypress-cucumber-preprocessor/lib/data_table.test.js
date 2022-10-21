"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const data_table_1 = __importDefault(require("./data_table"));
describe("DataTable", () => {
    describe("table with headers", () => {
        const dataTable = {
            rows: [
                {
                    cells: [{ value: "header 1" }, { value: "header 2" }],
                },
                {
                    cells: [{ value: "row 1 col 1" }, { value: "row 1 col 2" }],
                },
                {
                    cells: [{ value: "row 2 col 1" }, { value: "row 2 col 2" }],
                },
            ],
        };
        describe("rows", () => {
            it("returns a 2-D array without the header", () => {
                assert_1.default.deepStrictEqual(new data_table_1.default(dataTable).rows(), [
                    ["row 1 col 1", "row 1 col 2"],
                    ["row 2 col 1", "row 2 col 2"],
                ]);
            });
        });
        describe("hashes", () => {
            it("returns an array of object where the keys are the headers", () => {
                assert_1.default.deepStrictEqual(new data_table_1.default(dataTable).hashes(), [
                    { "header 1": "row 1 col 1", "header 2": "row 1 col 2" },
                    { "header 1": "row 2 col 1", "header 2": "row 2 col 2" },
                ]);
            });
        });
        describe("transpose", () => {
            it("returns a new DataTable, with the data transposed", () => {
                assert_1.default.deepStrictEqual(new data_table_1.default(dataTable).transpose().raw(), [
                    ["header 1", "row 1 col 1", "row 2 col 1"],
                    ["header 2", "row 1 col 2", "row 2 col 2"],
                ]);
            });
        });
    });
    describe("table without headers", () => {
        const dataTable = {
            rows: [
                {
                    cells: [{ value: "row 1 col 1" }, { value: "row 1 col 2" }],
                },
                {
                    cells: [{ value: "row 2 col 1" }, { value: "row 2 col 2" }],
                },
            ],
        };
        describe("raw", () => {
            it("returns a 2-D array", () => {
                assert_1.default.deepStrictEqual(new data_table_1.default(dataTable).raw(), [
                    ["row 1 col 1", "row 1 col 2"],
                    ["row 2 col 1", "row 2 col 2"],
                ]);
            });
        });
        describe("rowsHash", () => {
            it("returns an object where the keys are the first column", () => {
                assert_1.default.deepStrictEqual(new data_table_1.default(dataTable).rowsHash(), {
                    "row 1 col 1": "row 1 col 2",
                    "row 2 col 1": "row 2 col 2",
                });
            });
        });
    });
    describe("table with something other than 2 columns", () => {
        const dataTable = {
            rows: [
                {
                    cells: [{ value: "row 1 col 1" }],
                },
                {
                    cells: [{ value: "row 2 col 1" }],
                },
            ],
        };
        describe("rowsHash", () => {
            it("throws an error if not all rows have two columns", function () {
                assert_1.default.throws(() => {
                    new data_table_1.default(dataTable).rowsHash();
                }, new Error("rowsHash can only be called on a data table where all rows have exactly two columns"));
            });
        });
    });
});
