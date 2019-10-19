import React from 'react'
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
} from 'react-share'
import config from '../../data/SiteConfig'

export default ({
    postNode: {
        frontmatter: { title, excerpt },
    },
    postPath,
}) => {
    const url =
        config.siteUrl +
        (config.pathPrefix === '/' ? '' : config.pathPrefix) +
        postPath

    return (
        <div className="social-links">
            <TwitterShareButton url={url} title={title}>
                <TwitterIcon size={42} />
            </TwitterShareButton>

            <FacebookShareButton url={url} quote={excerpt}>
                <FacebookIcon size={42} />
            </FacebookShareButton>
        </div>
    )
}
