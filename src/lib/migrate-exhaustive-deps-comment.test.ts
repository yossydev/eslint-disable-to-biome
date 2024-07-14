import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Project } from "ts-morph";
import { migrateExhaustiveDepsComment } from "./migrate-exhaustive-deps-comment.js";

describe("migrateExhaustiveDepsComment", () => {
	const project = new Project({
		tsConfigFilePath: "./tsconfig.json",
	});

	it("Should comments in useEffect change to biome and come to the top of the list.", () => {
		const file = project.createSourceFile(
			"./test/case1.ts",
			`import { useEffect } from 'react';
        export function Foo() {
          useEffect(()=>{
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);
          return null
        }
      `,
			{ overwrite: true },
		);
		migrateExhaustiveDepsComment(file);
		const result = file.getFullText();
		assert.equal(
			result.replace(/\s+/g, ""),
			`import{useEffect}from'react';exportfunctionFoo(){
// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(()=>{},[]); return null}`.replace(/\s+/g, ""),
		);
	});

	it("Should comments come before hooks with deps.", () => {
		const file = project.createSourceFile(
			"./test/case2.ts",
			`import { useState, useEffect } from 'react';
        export function Foo() {
          const [state, setState] = useState()
          useEffect(()=>{
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);
          return null
        }
      `,
			{ overwrite: true },
		);
		migrateExhaustiveDepsComment(file);
		const result = file.getFullText();
		assert.equal(
			result.replace(/\s+/g, ""),
			`import{useState,useEffect}from'react';exportfunctionFoo(){const[state,setState]=useState()
// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(()=>{},[]); return null}`.replace(/\s+/g, ""),
		);
	});

	it("Should the comment come on the line above useEffect (no blank space)", () => {
		const file = project.createSourceFile(
			"./test/case3.ts",
			`import { useState, useEffect } from 'react';
        export function Foo() {
          const [state, setState] = useState()

          useEffect(()=>{

          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          return null
        }
      `,
			{ overwrite: true },
		);
		migrateExhaustiveDepsComment(file);
		const result = file.getFullText();
		assert.equal(
			result.replace(/\s+/g, ""),
			`import{useState,useEffect}from'react';exportfunctionFoo(){const[state,setState]=useState()
// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(()=>{},[]); return null}`.replace(/\s+/g, ""),
		);
	});
});
