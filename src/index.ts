import { Command } from "commander";
import fs from "node:fs";
import { Project } from "ts-morph";
import { migrateExhaustiveDepsComment } from "./lib/migrate-exhaustive-deps-comment.js";
import { JsxEmit } from "typescript";

const program = new Command();

program
	.name("eslint-disable-to-biome")
	.description(
		"A cli tool that allows eslint disable comments that are left behind when migrating from eslint to biome to be transferred to biome.",
	)
	.version("0.1.0")
	.option(
		"--ext <extensions...>",
		"File extensions to include (default: ts,tsx)",
		"ts,tsx",
	)
	.argument("[glob]", "Glob pattern to match files")
	.action((globPattern, options) => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const files = fs.readdirSync(globPattern);

		const project = new Project({
			tsConfigFilePath: "./tsconfig.json",
			compilerOptions: {
				jsx: JsxEmit.React,
			},
		});

		console.log("files", files);
		for (const file of files) {
			const sourceFile = project.addSourceFileAtPath(file);
			migrateExhaustiveDepsComment(sourceFile);
		}

		console.log("Migration completed.");
	});

program.parse();
