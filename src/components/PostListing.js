import React, { Component } from "react"
import { Link } from 'gatsby'
import TimeAgo from 'react-timeago'

class PostListing extends Component
{
    getPostList() {
        const postList = []
        this.props.postEdges.forEach(postEdge => {
            postList.push({
                path:  postEdge.node.fields.slug,
                title: postEdge.node.frontmatter.title,
                date:  postEdge.node.frontmatter.date,
            })
        })
        return postList
    }

    render() {
        const postList = this.getPostList()
        const isHighlighted = this.props.isHighlighted
        postList.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
            });
        return (
            <ul className={['', (isHighlighted ? '--highlighted' : '--default')].map(item => `postlist${item}`).join(' ')}>

                {postList.map(post => {

                    const posted = new Date(post.date);
                    const postedIso = posted.toISOString();

                    return (
                        <li key={post.title} className="postlist__item">
                            <div className="postlist__inner">

                                <Link to={post.path} className="postlist__link">
                                    <div className="postlist__text">
                                        <div className="postlist__title">{post.title}</div>
                                        <div className="postlist__date"><TimeAgo date={postedIso} /></div>
                                    </div>
                                </Link>

                            </div>
                        </li>
                    )

                })}

            </ul>
        )
    }
}

export default PostListing
