import React from 'react'
import Helmet from 'react-helmet'
import config from '../../data/SiteConfig'

export default ({ postNode, postPath, postSEO }) => {
    let title
    let description
    let image
    let postURL
    let titleHead
    let twitterImage
    let facebookImage

    twitterImage = config.siteUrl + '/' + config.siteLogo
    facebookImage = config.siteUrl + '/' + config.siteLogo

    if (postSEO) {
        const postMeta = postNode.frontmatter

        title = postMeta.title
        titleHead = `${postMeta.title} | ${config.siteTitle}`

        description = postMeta.desc ? postMeta.desc : postNode.excerpt

        image = config.siteUrl + '/' + postMeta.cover
        postURL = config.siteUrl + postPath

        twitterImage = postMeta.twitter
            ? config.siteUrl + '/' + postMeta.twitter
            : twitterImage
        facebookImage = postMeta.facebook
            ? config.siteUrl + '/' + postMeta.facebook
            : facebookImage
    } else {
        title = config.siteTitle
        titleHead = `${config.siteTitle} - ${config.siteDescription}`
        description = config.siteDescription
        image = config.siteUrl + '/' + config.siteLogo
    }

    const blogURL = config.siteUrl

    const schemaOrgJSONLD = [
        {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            url: blogURL,
            name: title,
            alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
        },
    ]

    if (postSEO) {
        schemaOrgJSONLD.push(
            {
                '@context': 'http://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        item: {
                            '@id': postURL,
                            name: title,
                            image,
                        },
                    },
                ],
            },
            {
                '@context': 'http://schema.org',
                '@type': 'BlogPosting',
                url: blogURL,
                name: title,
                alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
                headline: title,
                image: {
                    '@type': 'ImageObject',
                    url: image,
                },
                description,
            }
        )
    }

    return (
        <Helmet>
            <html lang="en" />

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <title>{titleHead}</title>

            {/* General tags */}
            <meta name="description" content={description} />
            <meta name="image" content={image} />

            {postSEO && (
                <link
                    rel="canonical"
                    href={`${config.siteUrl + postPath.replace(/\/$/, '')}`}
                />
            )}

            {/* Schema.org tags */}
            <script type="application/ld+json">
                {JSON.stringify(schemaOrgJSONLD)}
            </script>

            {/* OpenGraph tags */}
            <meta property="og:url" content={postSEO ? postURL : blogURL} />
            {postSEO && <meta property="og:type" content="article" />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={facebookImage} />
            <meta
                property="fb:app_id"
                content={config.siteFBAppID ? config.siteFBAppID : ''}
            />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {config.userTwitter && (
                <meta name="twitter:creator" content={config.userTwitter} />
            )}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={twitterImage} />

            {/* Icons */}
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg"
                color="#dd3e28"
            />
            <meta name="msapplication-TileColor" content="#dd3e28" />
            <meta name="theme-color" content="#dd3e28" />
        </Helmet>
    )
}
