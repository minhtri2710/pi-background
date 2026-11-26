import assert from "node:assert/strict";
import test from "node:test";
import { previewJobOutput } from "./job-output-preview.ts";

test("previews the latest non-empty output line", () => {
	assert.equal(previewJobOutput("first line\n  echo\tOK  \n\n"), "echo OK");
});

test("marks missing output and truncates long previews", () => {
	assert.equal(previewJobOutput("\n  \n"), "waiting for output");
	const preview = previewJobOutput("x".repeat(60));
	assert.equal(Array.from(preview).length, 56);
	assert.ok(preview.endsWith("…"));
});
