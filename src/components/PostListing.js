import React from 'react'
import { Link } from 'gatsby'

export default ({ posts, isHighlighted }) => (
    <ul
        className={[
            isHighlighted ? 'postlist--highlighted' : 'postlist--default',
        ]}
    >
        {posts.map(
            ({
                node: {
                    fields: { slug },
                    frontmatter: { title, date },
                },
            }) => (
                <li key={title} className="postlist__item">
                    <div className="postlist__inner">
                        <Link to={slug} className="postlist__link">
                            <div className="postlist__text">
                                <div className="postlist__title">{title}</div>
                            </div>
                        </Link>
                    </div>
                </li>
            )
        )}
    </ul>
)
