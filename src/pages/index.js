import React, { Component } from 'react';
import { graphql } from 'gatsby';

import PostListing from '../components/PostListing';
import SEO from '../components/SEO/SEO';
import Sweet from './sweet.svg';
import Spicy from './spicy.svg';
import Layout from '../components/layout.js';

class IndexPage extends Component {
    render() {
        const posts = this.props.data.allMarkdownRemark.edges;

        return (
            <Layout className="home">
                <SEO postEdges={posts} />

                <div className="home__limiter">
                    <div className="home__banner">
                        <h1 className="home__logo">Cruftless Craft</h1>

                        <div className="home__intro">
                            Sweet <img src={Sweet} alt="" aria-hidden="true" />{' '}
                            and spicy{' '}
                            <img src={Spicy} alt="" aria-hidden="true" /> dev
                            tips for Craft CMS
                        </div>
                    </div>

                    <nav className="home__listings">
                        <PostListing postEdges={posts} isHighlighted />
                    </nav>

                    <div className="home__links">
                        <a href="mailto:hello@cruftlesscraft.com">
                            hello@cruftlesscraft.com
                        </a>{' '}
                        &middot;{' '}
                        <a
                            href="https://twitter.com/cruftlesscraft"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            twitter.com/cruftlesscraft
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default IndexPage;

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
    query {
        allMarkdownRemark(limit: 2000) {
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        cover
                        date
                    }
                }
            }
        }
    }
`;
