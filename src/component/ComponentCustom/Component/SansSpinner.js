import React from 'react';
import { Spinner } from 'react-bootstrap';

export const SansSpinnerOnTable = () => (
    <tr>
        <td colSpan="100%" className="text-center">
            <Spinner animation="border" />
        </td>
    </tr>
);

export const SansNothingOnTable = () => (
    <tr>
        <td colSpan="100%" className="text-center">
            No data available
        </td>
    </tr>
);
