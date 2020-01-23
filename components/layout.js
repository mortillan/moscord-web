import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from './nav'

const Layout = ({ children }) => {
    return <>
        <Nav />
        <Container className="pt-4">
            {children}
        </Container>
    </>
}

export default Layout