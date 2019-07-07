const config = require('./data/SiteConfig');

const pathPrefix = config.pathPrefix === '/' ? '' : config.pathPrefix;

module.exports = {
    pathPrefix: config.pathPrefix,
    siteMetadata: {
        title: `Cruftless Craft`,
        description: `Sweet and Spicy dev tips for Craft CMS`,
        siteUrl: config.siteUrl + pathPrefix,
        rssMetadata: {
            site_url: config.siteUrl + pathPrefix,
            feed_url: config.siteUrl + pathPrefix + config.siteRss,
            title: config.siteTitle,
            description: config.siteDescription,
            image_url: `${config.siteUrl + pathPrefix}/logos/logo-512.png`,
            author: config.userName,
            copyright: config.copyright
        }
    },
    plugins: [
        {
            resolve: 'gatsby-plugin-feed'
        },
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}${config.blogPostDir}`
            }
        },
        {
            resolve: 'gatsby-transformer-remark', // Markdown
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 690
                        }
                    },
                    {
                        resolve: 'gatsby-remark-responsive-iframe'
                    },
                    {
                        resolve: 'gatsby-remark-external-links',
                        options: {
                            target: '_blank'
                        }
                    },
                    'gatsby-remark-smartypants',
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-autolink-headers',
                    'gatsby-remark-prismjs' // keep this under autolink headers https://github.com/gatsbyjs/gatsby/issues/5764
                ]
            }
        },
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
                trackingId: config.googleAnalyticsID
            }
        },
        'gatsby-plugin-sass',
        'gatsby-plugin-sharp', // image manipulation
        'gatsby-plugin-sitemap',
        'gatsby-plugin-offline',
        'gatsby-plugin-remove-trailing-slashes'
    ]
};
