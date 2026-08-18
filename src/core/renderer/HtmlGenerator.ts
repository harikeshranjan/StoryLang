import type {
	Chapter,
	Dialogue,
	Paragraph,
	Scene,
	Story,
	StoryNode,
} from "../ast/AST.js";

export class HtmlGenerator {
	public generate(story: Story): string {
		const title = this.getMetadata(story, "title") ?? "Untitled Story";

		const body = this.generateStory(story);

		return `<!DOCTYPE html>
	<html lang="en">
	<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${this.escapeHtml(title)}</title>

  <style>
    ${this.generateStyles()}
  </style>
	</head>

	<body>
  <main class="story">
    ${body}
  </main>
	</body>
	</html>`;
	}

	private generateStory(story: Story): string {
		const metadata = this.generateMetadata(story);
		const children = story.children
			.map((node) => this.generateNode(node))
			.join("\n");

		return `${metadata}
		${children}`;
	}

	private generateMetadata(story: Story): string {
		const title = this.getMetadata(story, "title");

		if (!title) {
			return "";
		}

		return `
	      <header class="story-header">
	        <h1>${this.escapeHtml(title)}</h1>
	      </header>
	    `;
	}

	private generateNode(node: StoryNode): string {
		switch (node.type) {
			case "chapter":
				return this.generateChapter(node);

			case "scene":
				return this.generateScene(node);

			case "dialogue":
				return this.generateDialogue(node);

			case "paragraph":
				return this.generateParagraph(node);

			default:
				return "";
		}
	}

	private generateChapter(chapter: Chapter): string {
		const children = chapter.children
			.map((node) => this.generateNode(node))
			.join("\n");

		return `
	      <section class="chapter">
	        <h2 class="chapter-title">
	          ${this.escapeHtml(chapter.title)}
	        </h2>

	        <div class="chapter-content">
	          ${children}
	        </div>
	      </section>
	    `;
	}

	private generateScene(scene: Scene): string {
		const children = scene.children
			.map((node) => this.generateNode(node))
			.join("\n");

		return `
	      <section class="scene">
	        <div class="scene-break" aria-hidden="true">
	          <span>✦</span>
	        </div>

	        <div class="scene-content">
	          ${children}
	        </div>
	      </section>
	    `;
	}

	private generateDialogue(dialogue: Dialogue): string {
		return `
	      <div class="dialogue">
	        <div class="speaker">
	          ${this.escapeHtml(dialogue.speaker)}
	        </div>

	        <p class="dialogue-text">
	          ${this.escapeHtml(dialogue.text)}
	        </p>
	      </div>
	    `;
	}

	private generateParagraph(paragraph: Paragraph): string {
		return `
			<p class="paragraph">
				${this.escapeHtml(paragraph.text)}
			</p>
		`;
	}

	private getMetadata(story: Story, key: string): string | undefined {
		return story.metadata.find((metadata) => metadata.key === key)?.value;
	}

	private escapeHtml(html: string): string {
		return html
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	private generateStyles(): string {
		return `
      :root {
        font-family:
          Georgia,
          "Times New Roman",
          serif;

        color: #222;
        background: #fff;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }

      .story {
        width: min(720px, 100%);
        margin: 0 auto;
        padding: 64px 24px;
      }

      .story-header {
        text-align: center;
        margin-bottom: 80px;
      }

      .story-header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
      }

      .chapter {
        margin-bottom: 72px;
      }

      .chapter-title {
        margin: 0 0 40px;
        text-align: center;
        font-size: 1.8rem;
        font-weight: 600;
      }

      .paragraph {
        margin: 0 0 1.25rem;
        font-size: 1.1rem;
        line-height: 1.8;
      }

      .dialogue {
        margin: 1.5rem 0;
      }

      .speaker {
        margin-bottom: 0.25rem;
        font-weight: 700;
      }

      .dialogue-text {
        margin: 0;
        font-size: 1.1rem;
        line-height: 1.8;
      }

      .scene {
        margin: 2.5rem 0;
      }

      .scene-break {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
      }

      .scene-break span {
        font-size: 1rem;
      }

      @media (max-width: 600px) {
        .story {
          padding: 40px 20px;
        }

        .story-header h1 {
          font-size: 2rem;
        }

        .paragraph,
        .dialogue-text {
          font-size: 1rem;
        }
      }

      @media print {
        .story {
          width: 100%;
          max-width: none;
          padding: 0;
        }

        .chapter {
          break-before: page;
        }
      }
    `;
	}
}
