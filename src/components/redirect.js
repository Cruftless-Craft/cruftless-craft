import React, { Component } from 'react'
import { Redirect } from '@reach/router'

class RedirectNoSlash extends Component {
    render() {
        const returnRedirect = () => {
            const { pathname } = this.props
            if (typeof window !== "undefined" && pathname) {
                const hasTrailingSlash = !!pathname.match(/\/$/)
                if (hasTrailingSlash) {
                    const redirect = pathname.replace(/\/$/, '')
                    return <Redirect to={redirect} />
                }
            }
            return <div />
        }
        return returnRedirect()
    }
}

export default RedirectNoSlash
