import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/SEO'

export default () => (
    <Layout className="error">
        <SEO />

        <Helmet>
            <title>Error 404</title>
        </Helmet>

        <div className="error__limiter">
            <div className="error__banner">
                <h1 className="error__title">Sorry, this page wasn't found</h1>

                <div className="error__intro">
                    Try a refresh or <Link to={'/'}>head back home</Link>
                </div>
            </div>
        </div>
    </Layout>
)
