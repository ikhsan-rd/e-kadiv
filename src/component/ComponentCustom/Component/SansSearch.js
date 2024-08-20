// FilterSearch.jsx
import React from 'react';
import { Form,Col } from 'react-bootstrap';

const SansSearch = ({
    searchTerm = '',
    onSearchChange = () => { },
}) =>
{
    return (

        <Form.Group as={Col} style={{ flex: '2' }} controlId="search">
            <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
            />
        </Form.Group>
    );

};

export default SansSearch;
