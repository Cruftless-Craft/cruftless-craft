import React from 'react';
import '../scss/index.scss';

export default ({ children, className, pathname }) => (
    <div className={className}>{children}</div>
);
