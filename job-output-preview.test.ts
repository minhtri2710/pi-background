import assert from "node:assert/strict";
import test from "node:test";
import { tailWindow, terminalLines } from "./job-output-preview.ts";

test("terminal lines apply carriage returns and wrap to width", () => {
	assert.deepEqual(terminalLines("10%\r50%\r100%\r\ndone\n", 80), ["100%", "done"]);
	assert.deepEqual(terminalLines("abcdefgh", 4), ["abcd", "efgh"]);
	assert.deepEqual(terminalLines("a\n\nb", 4), ["a", "", "b"]);
});

test("tail window follows the bottom and clamps scrolling", () => {
	const lines = ["1", "2", "3", "4", "5"];
	assert.deepEqual(tailWindow(lines, 2, 0), { lines: ["4", "5"], scroll: 0 });
	assert.deepEqual(tailWindow(lines, 2, 1), { lines: ["3", "4"], scroll: 1 });
	assert.deepEqual(tailWindow(lines, 2, 99), { lines: ["1", "2"], scroll: 3 });
	assert.deepEqual(tailWindow(lines, 9, 4), { lines, scroll: 0 });
});
