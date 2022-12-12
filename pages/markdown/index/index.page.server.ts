import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { getMarkdownList } from '../../../packages/markdown'

const markdownList = getMarkdownList()
const names = markdownList.map(el => el.key)

async function onBeforeRender(pageContext: PageContextBuiltIn) {
    // const { key } = pageContext.routeParams
    // if (key !== 'anonymous' && !names.includes(key)) {
    //     const errorInfo = `Unknown name: ${key}.`
    //     throw RenderErrorPage({ pageContext: { pageProps: { errorInfo } } })
    // }

    const pageProps = {
        markdownList
    }
    return {
        pageContext: {
            pageProps
        }
    }
}

function prerender() {
    return names.map((name) => `/markdown/${name}`)
}

export { onBeforeRender }
export { prerender }