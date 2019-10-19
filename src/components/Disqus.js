import React from 'react'
import ReactDisqusComments from 'react-disqus-comments'
import config from '../../data/SiteConfig'

export default ({
    postNode: {
        frontmatter: { title, category_id },
        fields: { slug },
    },
}) =>
    config.disqusShortname && (
        <ReactDisqusComments
            shortname={config.disqusShortname}
            identifier={title}
            title={title}
            url={config.siteUrl + config.pathPrefix + slug}
            category_id={category_id}
        />
    )
