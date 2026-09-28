import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/mdx/components";
export type Heading = { id: string; text: string; level: number };
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { id?: string };
  children?: Node[];
};
function plainText(node: Node): string {
  return node.value || node.children?.map(plainText).join("") || "";
}
export async function renderContent(source: string) {
  const headings: Heading[] = [];
  function collectHeadings() {
    return (tree: Node) => {
      function walk(node: Node) {
        if (
          node.type === "element" &&
          ["h2", "h3"].includes(node.tagName || "") &&
          node.properties?.id &&
          plainText(node) !== "Footnotes"
        )
          headings.push({
            id: node.properties.id,
            text: plainText(node),
            level: Number(node.tagName?.slice(1)),
          });
        node.children?.forEach(walk);
      }
      walk(tree);
    };
  }
  // Only compile trusted repository content. Expressions enable typed component props.
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, collectHeadings],
      },
    },
  });
  return { content, headings };
}
