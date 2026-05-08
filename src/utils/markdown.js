import { marked } from 'marked'
import katex from 'katex'

/**
 * Render markdown with LaTeX math support ($...$ inline, $$...$$ block).
 */
export function renderMarkdown(content) {
  if (!content) return ''

  // Pre-process: protect math blocks from being mangled by marked
  const mathBlocks = []
  let processed = content

  // 1. Protect $$...$$ block math (multi-line aware)
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'block', formula: formula.trim() })
    return `@@MATHBLOCK${idx}@@`
  })

  // 2. Protect $...$ inline math
  processed = processed.replace(/\$(.+?)\$/g, (_, formula) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'inline', formula: formula.trim() })
    return `@@MATHINLINE${idx}@@`
  })

  // Render markdown
  let html = marked.parse(processed)

  // Post-process: restore math blocks with KaTeX rendered HTML
  mathBlocks.forEach((block, idx) => {
    try {
      const rendered = katex.renderToString(block.formula, {
        displayMode: block.type === 'block',
        throwOnError: false
      })
      if (block.type === 'block') {
        html = html.replace(`@@MATHBLOCK${idx}@@`, rendered)
      } else {
        // Inline: wrap in span so it doesn't break paragraph flow
        html = html.replace(`@@MATHINLINE${idx}@@`, rendered)
        // marked may wrap the placeholder in <p> and add extra <br> — clean up
        html = html.replace(`<p>${rendered}</p>`, rendered)
      }
    } catch (e) {
      // Fallback: show raw formula if KaTeX fails
      const fallback = block.type === 'block'
        ? `<pre>${block.formula}</pre>`
        : `$${block.formula}$`
      html = html.replace(`@@MATHBLOCK${idx}@@`, fallback)
      html = html.replace(`@@MATHINLINE${idx}@@`, fallback)
    }
  })

  return html
}
