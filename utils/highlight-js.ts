function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const KEYWORDS = new Set([
  "async", "await", "break", "case", "catch", "class", "const", "continue",
  "default", "delete", "do", "else", "export", "extends", "false", "finally",
  "for", "function", "if", "import", "in", "instanceof", "let", "new", "null",
  "of", "return", "static", "super", "switch", "this", "throw", "true", "try",
  "typeof", "undefined", "var", "void", "while", "yield",
]);

type Token = { type: "plain" | "comment" | "string"; value: string };

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const value = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: "comment", value });
      i += value.length;
      continue;
    }

    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const value = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: "comment", value });
      i += value.length;
      continue;
    }

    if (code[i] === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === "`") { j++; break; }
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }

    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === '"') { j++; break; }
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }

    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === "'") { j++; break; }
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }

    let j = i + 1;
    while (j < code.length && !"`'\"/".includes(code[j]!)) j++;
    tokens.push({ type: "plain", value: code.slice(i, j) });
    i = j;
  }

  return tokens;
}

function highlightPlain(text: string): string {
  const re = /([A-Za-z_$][\w$]*|\d+(?:\.\d+)?|[^A-Za-z_$0-9]+)/g;
  let out = "";
  let expectClassName = false;
  let expectExtendsName = false;
  let prevIdent = "";

  for (const match of text.matchAll(re)) {
    const val = match[0];
    const idx = match.index ?? 0;
    const after = text.slice(idx + val.length);

    if (!/^[A-Za-z_$]/.test(val) && !/^\d/.test(val)) {
      out += escapeHtml(val);
      if (!/^\s+$/.test(val)) {
        expectClassName = false;
        expectExtendsName = false;
      }
      continue;
    }

    if (/^\d/.test(val)) {
      out += `<span class="hl-number">${escapeHtml(val)}</span>`;
      expectClassName = false;
      expectExtendsName = false;
      prevIdent = val;
      continue;
    }

    if (expectClassName || expectExtendsName) {
      out += `<span class="hl-class">${escapeHtml(val)}</span>`;
      expectClassName = false;
      expectExtendsName = false;
      prevIdent = val;
      continue;
    }

    if (val === "customElements" && /^\s*\.\s*define/.test(after)) {
      out += `<span class="hl-builtin">${escapeHtml(val)}</span>`;
      prevIdent = val;
      continue;
    }

    if (prevIdent === "customElements" && val === "define") {
      out += `<span class="hl-function">${escapeHtml(val)}</span>`;
      prevIdent = val;
      continue;
    }

    if (KEYWORDS.has(val)) {
      out += `<span class="hl-keyword">${escapeHtml(val)}</span>`;
      expectClassName = val === "class";
      expectExtendsName = val === "extends";
      prevIdent = val;
      continue;
    }

    if (/^\s*\(/.test(after)) {
      out += `<span class="hl-function">${escapeHtml(val)}</span>`;
      prevIdent = val;
      continue;
    }

    out += escapeHtml(val);
    prevIdent = val;
    expectClassName = false;
    expectExtendsName = false;
  }

  return out;
}

export function highlightJavaScript(code: string): string {
  return tokenize(code)
    .map((token) => {
      if (token.type === "comment") return `<span class="hl-comment">${escapeHtml(token.value)}</span>`;
      if (token.type === "string") return `<span class="hl-string">${escapeHtml(token.value)}</span>`;
      return highlightPlain(token.value);
    })
    .join("");
}
