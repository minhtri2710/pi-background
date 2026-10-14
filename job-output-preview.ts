const MAX_PREVIEW_CHARS = 56;

export function previewJobOutput(output: string, maxChars = MAX_PREVIEW_CHARS): string {
	const lastLine = output
		.split(/\r?\n/)
		.filter((line) => line.trim().length > 0)
		.at(-1)
		?.replace(/\s+/g, " ")
		.trim();
	if (!lastLine) return "waiting for output";

	const characters = Array.from(lastLine);
	return characters.length > maxChars
		? `${characters.slice(0, maxChars - 1).join("")}…`
		: lastLine;
}
