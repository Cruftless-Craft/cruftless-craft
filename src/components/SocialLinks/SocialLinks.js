import React, { Component } from "react"
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
} from "react-share";
import config from "../../../data/SiteConfig"

class SocialLinks extends Component {
    render() {
        const { postNode, postPath } = this.props;
        const post = postNode.frontmatter;
        const realPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix;
        const url = config.siteUrl + realPrefix + postPath;
        const iconSize = 42;

        return (
            <div className="social-links">

            <TwitterShareButton url={url} title={post.title}>
            <TwitterIcon size={iconSize} />
            </TwitterShareButton>

            <FacebookShareButton url={url} quote={postNode.excerpt}>
            <FacebookIcon size={iconSize} />
            </FacebookShareButton>

            </div>
        );
    }
}

export default SocialLinks
