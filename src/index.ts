import { Command } from "commander";
import { Project } from "ts-morph";
import { migrateExhaustiveDepsComment } from "./lib/migrate-exhaustive-deps-comment.js";
import { glob } from "glob";

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
		const extensions = options.ext[0].split(",").map((ext: any) => ext.trim());
		const files = glob.sync(globPattern, { nodir: true });

		const project = new Project();

		for (const file of files) {
			if (extensions.includes(file.split(".").pop())) {
				const sourceFile = project.addSourceFileAtPath(file);
				migrateExhaustiveDepsComment(sourceFile);
			}
		}

		console.log("Migration completed.");
	});

program.parse();
