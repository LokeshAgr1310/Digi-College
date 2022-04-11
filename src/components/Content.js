import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Content() {
    return <div style={{ backgroundColor: '#ddd' }}>
        <Container>
            <Row className='py-4 align-items-center'>
                <Col>
                    <Image src='Images/landing-bg-image.png' alt="something went wrong!" />
                </Col>
                <Col>
                    <h2>Canva is the world's easiest design tool. And the best part? It's free. Whether it's a poster or study guide, you can create beautiful designs</h2>
                    <div className='d-flex justify-content-center py-2'>
                        <Link to='/login'>
                            <Button variant='outline-primary' size="lg" >Get Started</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>;
}

export default Content;
