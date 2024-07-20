import { Command } from "commander";
const program = new Command();

program
	.name("eslint-disable-to-biome")
	.description(
		"A cli tool that allows eslint disable comments that are left behind when migrating from eslint to biome to be transferred to biome.",
	)
	.version("0.1.0");

program.parse();
