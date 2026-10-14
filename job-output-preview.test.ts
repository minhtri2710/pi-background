import { expect, test } from "bun:test";
import { previewJobOutput } from "./job-output-preview.ts";

test("previews the latest non-empty output line", () => {
	expect(previewJobOutput("first line\n  echo\tOK  \n\n")).toBe("echo OK");
});

test("marks missing output and truncates long previews", () => {
	expect(previewJobOutput("\n  \n")).toBe("waiting for output");
	const preview = previewJobOutput("x".repeat(60));
	expect(Array.from(preview)).toHaveLength(56);
	expect(preview.endsWith("…")).toBe(true);
});
