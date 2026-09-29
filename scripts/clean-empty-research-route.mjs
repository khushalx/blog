import { rm } from "node:fs/promises";
import path from "node:path";

// Next's static export requires one generated path for every dynamic route.
// The reserved research path renders a 404 while the library has no reports;
// remove its exported files so hosts return an actual HTTP 404 as well.
const output = path.join(process.cwd(), "out", "research");
await rm(path.join(output, "__no_research__"), { recursive: true, force: true });
await rm(path.join(output, "__no_research__.html"), { force: true });
