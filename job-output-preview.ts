import { wrapTextWithAnsi } from "@earendil-works/pi-tui";

// Renders output like a terminal would: a bare \r rewrites the line (progress bars), tabs become spaces.
export function terminalLines(output: string, width: number): string[] {
	const lines = output.replace(/\r\n/g, "\n").split("\n");
	if (lines.at(-1) === "") lines.pop();
	return lines.flatMap((line) => {
		const visible = (line.split("\r").filter(Boolean).at(-1) ?? "").replace(/\t/g, "    ");
		return visible ? wrapTextWithAnsi(visible, width) : [""];
	});
}

// scroll counts lines up from the bottom; 0 follows new output.
export function tailWindow(lines: string[], height: number, scroll: number): { lines: string[]; scroll: number } {
	const clamped = Math.max(0, Math.min(scroll, lines.length - height));
	const end = lines.length - clamped;
	return { lines: lines.slice(Math.max(0, end - height), end), scroll: clamped };
}
