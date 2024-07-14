import { Project } from "ts-morph";

const project = new Project({
	tsConfigFilePath: "./tsconfig.json",
});
const sourceFiles = project.getSourceFiles();
