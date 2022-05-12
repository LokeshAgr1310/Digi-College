import React from 'react';
import { Alert } from 'react-bootstrap'

function Message({ variant, children }) {
    return <div>
        <Alert variant={variant}
            style={{
                fontSize: '15px'
            }}
        >
            {children}
        </Alert>
    </div>;
}

export default Message;
