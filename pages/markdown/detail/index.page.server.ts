import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { getMarkdownContent } from '../../../packages/markdown'

async function onBeforeRender(pageContext: PageContextBuiltIn) {
    const { key } = pageContext.routeParams
    console.log('key', key)

    const markdown = getMarkdownContent(key)

    const pageProps = {
        markdown,
    }
    return {
        pageContext: {
            pageProps
        }
    }
}

export { onBeforeRender }
