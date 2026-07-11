import { html as htmHtml } from "htm/preact"
import { h, type JSX } from "preact"

/**
 * Template tag function for HTML markup with automatic whitespace normalization.
 * 
 * Normalizes whitespace before HTML elements (newlines/tabs become spaces) to
 * prevent spacing issues in rendered output.
 * 
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns Preact VNode or array of VNodes
 */
export function html(
  strings: TemplateStringsArray,
  ...values: Array<any>
): ReturnType<typeof htmHtml> {
  const processed = strings.map(str => 
    (str ?? '').replace(/([^\s>])(\s*)(<[a-zA-Z][^>]*>)/g, (_, text, whitespace, tag) => {
      if (!whitespace) return `${text}${tag}`
      if (whitespace.includes('\n') || whitespace.includes('\t')) return `${text} ${tag}`
      return `${text}${whitespace}${tag}`
    })
  )
  return htmHtml(Object.assign(processed, { raw: processed }) as TemplateStringsArray, ...values)
}

/**
 * Template tag function for CSS styles.
 * 
 * Creates a Preact style element with the provided CSS content.
 * 
 * @param strings - Template string parts containing CSS
 * @param values - Interpolated values (strings, numbers, null, or undefined)
 * @returns Preact JSX.Element representing a <style> tag
 * 
 * @warning Only use with trusted, hardcoded CSS. Sanitize CSS from external
 * sources to prevent XSS attacks.
 */
export function css(
  strings: TemplateStringsArray,
  ...values: Array<string | number | null | undefined>
): JSX.Element {
  let content = ""

  for (let i = 0; i < strings.length; i++) {
    content += strings[i]
    if (i < values.length && values[i] != null) {
      content += values[i]
    }
  }

  return h("style", {
    dangerouslySetInnerHTML: { __html: content.trim() }
  })
}
