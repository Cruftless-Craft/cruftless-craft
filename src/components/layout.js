import React from 'react'
import '../scss/index.scss'

export default ({ children, className }) => (
    <div className={className}>{children}</div>
)
