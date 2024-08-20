import React from 'react';
import { Spinner } from 'react-bootstrap';

const SansSpinnerOnTable = () => (
    <tr>
        <td colSpan="100%" className="text-center">
                <Spinner animation="border" />
        </td>
    </tr>
);

export default SansSpinnerOnTable;
