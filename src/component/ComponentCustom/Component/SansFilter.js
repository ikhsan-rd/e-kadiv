// FilterSearch.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const SansFilter = ({
    filterOptions = [],
    selectedFilter = '',
    onFilterChange = () => { },
}) =>
{
    return (
        <Form.Select
            value={selectedFilter}
            onChange={e => onFilterChange(e.target.value)}
        >
            <option value="">Pilih</option>
            {filterOptions.map((option,index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Form.Select>

    );
};

export default SansFilter;
