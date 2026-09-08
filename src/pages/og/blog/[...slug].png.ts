import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getPosts, formatDate, type Post } from "../../../lib/posts";

// The light palette from global.css. OG cards render the same on every
// client, so the theme-aware tokens collapse to their light values here.
const BG = "#ffffff";
const FG = "#313842";
const MUTED = "#5d6570";
const ACCENT = "#4f6b8f";
const LINE = "#ccd3dc";

const WIDTH = 1200;
const HEIGHT = 630;

// Build-time only: the file is read from src/, never copied into dist/.
// Resolved from the project root because this module runs from dist/ during
// the build, where a URL relative to import.meta.url would not find it.
const font = readFileSync(
  resolve(process.cwd(), "src/fonts/NotoSansJP-Medium.otf"),
);

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

/** satori takes a React-shaped VDOM; plain objects keep this file JSX-free. */
const node = (type: string, props: Record<string, unknown>) => ({
  type,
  props,
  key: null,
});

const text = (content: string, style: Record<string, unknown>) =>
  node("div", { style, children: content });

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const { title, tags, pubDate } = post.data;

  // Japanese titles run about 18 characters per line at 62px.
  const titleSize = title.length > 36 ? 46 : title.length > 22 ? 54 : 62;

  const svg = await satori(
    node("div", {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: BG,
        color: FG,
        border: `1px solid ${LINE}`,
        fontFamily: "Noto Sans JP",
      },
      children: [
        node("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: MUTED,
            fontSize: "24px",
            letterSpacing: "0.14em",
          },
          children: [
            node("div", {
              style: { width: "28px", height: "3px", background: ACCENT },
            }),
            text("NONICA", {}),
          ],
        }),
        text(title, {
          // A block box, not satori's default flex, so lineClamp applies.
          display: "block",
          fontSize: `${titleSize}px`,
          lineHeight: 1.3,
          letterSpacing: "0.01em",
          // A very long title steps down a size, then clips rather than
          // pushing the footer off the card.
          lineClamp: 4,
        }),
        node("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            paddingTop: "28px",
            borderTop: `1px solid ${LINE}`,
            color: MUTED,
            fontSize: "26px",
            letterSpacing: "0.06em",
          },
          children: [
            text(formatDate(pubDate), {}),
            node("div", {
              style: { display: "flex", gap: "14px" },
              children: tags.slice(0, 4).map((tag) =>
                text(tag, {
                  border: `1px solid ${LINE}`,
                  padding: "2px 14px",
                }),
              ),
            }),
          ],
        }),
      ],
    }),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Noto Sans JP",
          data: font,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
