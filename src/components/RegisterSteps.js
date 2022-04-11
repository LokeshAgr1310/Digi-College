import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function RegisterSteps({ step1, step2, step3, step4, currStep }) {
    return (
        <Nav className="justify-content-center mb-4"
            style={{
                fontSize: '18px'
            }}
        >
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/register/step=1">
                        <Nav.Link className={`${currStep === "1" && 'active'}`}>Personal Details</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Personal Details</Nav.Link>
                )
                }
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/register/step=2">
                        <Nav.Link className={`${currStep === "2" && 'active'}`}>Communication Details</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Communication Details</Nav.Link>
                )
                }
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/register/step=3">
                        <Nav.Link className={`${currStep === "3" && 'active'}`}>Education Details</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Education Details</Nav.Link>
                )
                }
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/register/step=4">
                        <Nav.Link className={`${currStep === "4" && 'active'}`}>Register</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Register</Nav.Link>
                )
                }
            </Nav.Item>
        </Nav>
    )
}

export default RegisterSteps