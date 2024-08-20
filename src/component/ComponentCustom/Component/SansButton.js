import React from 'react';
import { Button } from 'react-bootstrap';
import { PencilSquare,Trash,ShieldLock } from 'react-bootstrap-icons';
import '../../../css/button.scss'

export const SansButtonEdit = ({ onClick }) => (
    <Button className='button-edit' variant='success' onClick={onClick}>
        <PencilSquare className='edit-custom' />
    </Button>
);

export const SansButtonDelete = ({ onClick }) => (
    <Button className='button-delete-1' variant='danger' onClick={onClick}>
        <Trash className='trash-custom-1' />
    </Button>
);

export const SansButtonProtect = ({ onClick }) => (
    <Button className='button-shield' variant='warning' style={{ cursor: 'not-allowed' }} onClick={onClick}>
        <ShieldLock className='shield-custom' />
    </Button>
);
