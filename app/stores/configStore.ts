import { ssrContext } from "/utils/ssr.client";
import type { SsrContext } from "/types/ssr-types";

export let staticRoot: string;

export const socialLinks = {
  twitter: "https://x.com/ranefaunder",
  bluesky: "https://bsky.app/profile/faunder.fi",
  instagram: "https://www.instagram.com/ranefaunder",
} as const;

export function initConfigStore(): void {
  const { initialConfig } = ssrContext();
  staticRoot = initialConfig?.staticRoot ?? "/static";
}
