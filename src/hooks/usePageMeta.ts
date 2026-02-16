import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;

    setMetaTag("description", meta.description, true);
    setCanonical(meta.canonical);

    // Open Graph
    setMetaTag("og:title", meta.title);
    setMetaTag("og:description", meta.description);
    setMetaTag("og:url", meta.canonical);
    setMetaTag("og:type", meta.ogType || "website");

    // Twitter
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", meta.title, true);
    setMetaTag("twitter:description", meta.description, true);
  }, [meta.title, meta.description, meta.canonical, meta.ogType]);
}
