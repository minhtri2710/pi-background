import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import background from "./background.ts";

test("pi-background-cancel stops a running job of this session and refuses another session's", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "bg-"));
  try {
    const tools: Record<string, any> = {}, sent: unknown[] = [];
    background({ registerTool: (tool: any) => { tools[tool.name] = tool; }, registerMessageRenderer: () => {}, registerShortcut: () => {}, registerCommand: () => {}, on: () => {}, sendMessage: (message: unknown) => sent.push(message) } as any);
    const ctx = (id: string) => ({ cwd, sessionManager: { getSessionId: () => id, getSessionFile: () => undefined } }) as any;
    const started = await tools["pi-background"].execute("t", { command: "sleep 30" }, undefined, undefined, ctx("s1"));
    const jobId = started.details.jobId;
    await assert.rejects(tools["pi-background-cancel"].execute("t", { jobId }, undefined, undefined, ctx("s2")), /Unknown background job/);
    assert.match((await tools["pi-background-cancel"].execute("t", { jobId }, undefined, undefined, ctx("s1"))).content[0].text, /Cancelled/);
    const job = (globalThis as any)[Symbol.for("pi-background.process-state")].jobs.get(jobId);
    while (job.status === "running") await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(job.status, "cancelled");
    assert.match((await tools["pi-background-cancel"].execute("t", { jobId }, undefined, undefined, ctx("s1"))).content[0].text, /already cancelled/);
    assert.deepEqual(sent, []);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
