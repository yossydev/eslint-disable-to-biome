import { Node, type SourceFile } from "ts-morph";

/**
 * @todo In the future, all hooks with deps will be supported.
 * @see https://biomejs.dev/linter/rules/use-exhaustive-dependencies/
 */
export const migrateExhaustiveDepsComment = (file: SourceFile): void => {
	for (const variableStatement of file.getVariableStatements()) {
		if (Node.isVariableStatement(variableStatement)) {
			const declarationList = variableStatement.getDeclarationList();
			if (Node.isVariableDeclarationList(declarationList)) {
				const declarationKind = declarationList.getDeclarations()[0];
				if (Node.isVariableDeclaration(declarationKind)) {
					const arrowFunction = declarationKind.getInitializer();
					if (Node.isArrowFunction(arrowFunction)) {
						const body = arrowFunction.getBody();
						if (Node.isNode(body)) {
							const statements = body.getDescendantStatements();
							for (let i = 0; i < statements.length; i++) {
								const statement = statements[i];
								if (Node.isExpressionStatement(statement)) {
									const expression = statement.getExpression();
									if (Node.isCallExpression(expression)) {
										const identifier = expression.getExpression();
										if (
											Node.isIdentifier(identifier) &&
											identifier.getText() === "useEffect"
										) {
											const eslintDisableComment =
												"// eslint-disable-next-line react-hooks/exhaustive-deps";
											const jsxText = expression.getText();
											if (jsxText.includes(eslintDisableComment)) {
												const newJsxText = jsxText
													.replace(eslintDisableComment, "")
													.replace(/\s+/g, " ")
													.trim();
												expression.replaceWithText(newJsxText);

												const commentPos = statement.getStart();
												const indentation = statement.getIndentationLevel();
												const indent = "  ".repeat(indentation);
												const commentText = `\n${indent}// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>\n`;
												arrowFunction.insertText(commentPos, commentText);

												break;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	for (const func of file.getFunctions()) {
		const body = func.getBody();
		if (Node.isNode(body)) {
			console.log("this is body");
			const statements = body.getDescendantStatements();
			for (let i = 0; i < statements.length; i++) {
				const statement = statements[i];
				if (Node.isExpressionStatement(statement)) {
					console.log("this is ExpressionStatement");
					const expression = statement.getExpression();
					if (Node.isCallExpression(expression)) {
						const identifier = expression.getExpression();
						console.log("identifier.getText()", identifier.getText());
						if (
							Node.isIdentifier(identifier) &&
							identifier.getText() === "useEffect"
						) {
							console.log("this is Identifier useEffect");
							console.log("identifier", identifier);
							const eslintDisableComment =
								"// eslint-disable-next-line react-hooks/exhaustive-deps";
							const jsxText = expression.getText();
							if (jsxText.includes(eslintDisableComment)) {
								const newJsxText = jsxText
									.replace(eslintDisableComment, "")
									.replace(/\s+/g, " ")
									.trim();
								expression.replaceWithText(newJsxText);

								const commentPos = statement.getStart();
								const indentation = statement.getIndentationLevel();
								const indent = "  ".repeat(indentation);
								const commentText = `\n${indent}// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>\n`;
								func.insertText(commentPos, commentText);

								break;
							}
						}
					}
				}
			}
		}
	}

	file.saveSync();
};
