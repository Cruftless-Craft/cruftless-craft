import React from 'react'
import { graphql, Link } from 'gatsby'

// Components
import SocialLinks from '../components/SocialLinks'
import SEO from '../components/SEO'
import Layout from '../components/layout'
import PostListing from '../components/PostListing'

// Assets
import Logo from './cruftless-logo.svg'
import BenPhoto from './ben-rogerson-author.png'

export default ({
    pageContext: { slug },
    location: { pathname },
    data: {
        post,
        post: {
            html,
            frontmatter: { cover, heading, title, date, updated, author },
        },
        posts: { edges },
    },
}) => {
    const postNode = post
    const posts = edges
    return (
        <Layout className="post" pathname={pathname}>
            <SEO postPath={slug} postNode={postNode} postSEO />

            <header className="header">
                <div className="header__logo">
                    <Link to={'/'} className="logo logo--top">
                        <img src={Logo} width="150" height="70" alt="Logo" />
                    </Link>
                </div>

                <div className="header__nav">
                    <div className="nav">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <Link to={'/'} className="nav__link">
                                    Articles
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <main className="post">
                <div
                    className={[
                        'post__header',
                        cover
                            ? 'post__header--image'
                            : 'post__header--no-image',
                    ].join(' ')}
                >
                    {cover && (
                        <div className="post__image">
                            <div
                                className="image"
                                style={{ paddingBottom: '71.42%' }}
                            >
                                <img
                                    className="image__item"
                                    src={`/${cover}`}
                                    width="210"
                                    height="150"
                                    alt=""
                                />
                            </div>
                        </div>
                    )}

                    <h1
                        className="post__title"
                        dangerouslySetInnerHTML={{ __html: heading || title }}
                    ></h1>

                    <div className="post__meta">
                        <div className="meta">
                            <div className="meta__image">
                                <img
                                    src={BenPhoto}
                                    width="75"
                                    height="76"
                                    alt="The ugly mug of the author"
                                />
                            </div>

                            <div className="meta__text">
                                by{' '}
                                <a href="https://benrogerson.com.au">
                                    {author}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="post__content richtext">
                    <div dangerouslySetInnerHTML={{ __html: html }} />

                    <div className="post__finish" aria-hidden="true">
                        <SocialLinks postPath={slug} postNode={postNode} />
                    </div>
                </div>

                <footer className="post__footer">
                    <div className="footer">
                        <div className="footer__limiter">
                            <div className="footer__group">
                                <Link
                                    to={'/'}
                                    className="footer__logo"
                                    aria-hidden="true"
                                >
                                    <img
                                        src={Logo}
                                        width="150"
                                        height="70"
                                        alt="Another logo, in the footer this time"
                                    />
                                </Link>

                                <nav className="footer__listings">
                                    <PostListing posts={posts} />
                                </nav>
                            </div>

                            <div className="footer__links">
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
                    </div>
                </footer>
            </main>
        </Layout>
    )
}

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
    query($slug: String!) {
        post: markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            timeToRead
            excerpt
            frontmatter {
                title
                heading
                cover
                desc
                date
                updated
                author
                twitter
                facebook
            }
            fields {
                slug
            }
        }
        posts: allMarkdownRemark(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { fields: { slug: { ne: $slug } } }
        ) {
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
`
