import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItContainer from "markdown-it-container";
import highlightJs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import chalk from "chalk";
import matter from "gray-matter";

interface Option {
	key: string;
	file_path: string;
	file_name: string;
	content?: string;
}

const cache = new Map<string, Option>();

const markdown: MarkdownIt = MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
	highlight: function (code, lang) {
		lang = lang.toLowerCase();

		lang = getLangCodeFromExtension(lang);

		if (lang && highlightJs.getLanguage(lang)) {
			try {
				return `<div class="language-${lang}"><pre><code>${
					highlightJs.highlight(code, { language: lang, ignoreIllegals: true })
						.value
				}</code></pre></div>`;
			} catch (e) {
				console.log(
					chalk.yellow(
						`[vuepress] Syntax highlight for language "${lang}" is not supported.`,
					),
				);
			}
		}

		return `<pre class="hljs"><code>${markdown.utils.escapeHtml(
			code,
		)}</code></pre>`;
	},
});

function getLangCodeFromExtension(extension: string): string {
	const extensionMap: Record<string, string> = {
		vue: "markup",
		html: "markup",
		md: "markdown",
		rb: "ruby",
		ts: "typescript",
		py: "python",
		sh: "bash",
		yml: "yaml",
		styl: "stylus",
		kt: "kotlin",
		rs: "rust",
	};

	return extensionMap[extension] || extension;
}

markdown
	.use(MarkdownItAnchor, {
		level: [1, 2],
		permalink: MarkdownItAnchor.permalink.linkInsideHeader({
			symbol: "#",
		}),
	})
	.use(MarkdownItContainer, "spoiler", {
		// validate: function (params) {
		// 	console.log("params", params);
		// 	return params.trim().match(/^spoiler\s+(.*)$/);
		// },
		render: function (tokens, idx) {
			const klass = "spoiler";
			const token = tokens[idx];
			const info = token.info.trim().slice(klass.length).trim();

			if (tokens[idx].nesting === 1) {
				const title = markdown.renderInline(info || "defaultTitle");
				return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`;
			} else {
				return "</div>\n";
			}
		},
	});

const __dirname = path.resolve();

let markdownList: Option[];

export function getMarkdownList(): Option[] {
	const markdown_path = path.join(__dirname, "lib/markdown");
	const file_names = readdirSync(markdown_path);
	const regx = new RegExp(/\.md$/);

	markdownList = file_names
		.filter((el) => regx.test(el))
		.map((file_name) => {
			return {
				key: file_name,
				file_name: file_name,
				file_path: path.join(__dirname, "lib/markdown", file_name),
			};
		});

	return markdownList;
}

export function getMarkdownContent(key: string): Option | Record<any, any> {
	if (cache.has(key)) {
		return cache.get(key) as Option;
	}

	if (!markdownList) {
		markdownList = getMarkdownList();
	}
	const option = markdownList.find((el) => el.key === key);
	if (option) {
		const file_path = option.file_path;

		const fileContents = readFileSync(file_path).toString();

		const { data, content } = matter(fileContents);
		option.content = markdown.render(content);

		cache.set(key, option);
		return option;
	}

	return {};
}
