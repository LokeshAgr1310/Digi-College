import React from 'react';
import { Spinner } from 'react-bootstrap'

function Loader({ height, width, applyClass }) {
    return (
        <Spinner
            animation='border'
            role='status'
            style={{
                height: `${height ? height : '100px'}`,
                width: `${width ? width : '100px'}`,
                margin: 'auto',
                display: 'block',
                color: 'black'
            }}
            className={applyClass}
        >
            <span className='sr-only'></span>
        </Spinner>
    );
}

export default Loader;
