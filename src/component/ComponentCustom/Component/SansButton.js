import React from 'react';
import { Button } from 'react-bootstrap';
import { PencilSquare,Trash,ShieldLock,Download,Eye, PlusLg } from 'react-bootstrap-icons';
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

export const SansButtonSee = ({ onClick }) => (
    <Button className='button-see-1' variant='primary' onClick={onClick}>
        <Eye className='eye-custom-1' />
    </Button>
);

export const SansButtonPrint = ({ onClick }) => (
    <Button className='button-edit' variant='primary' onClick={onClick}>
        <Download className='edit-custom' />
    </Button>
);

export const SansButtonPrintAll = ({ onClick }) => (
    <Button variant='primary' onClick={onClick}>
        Print
        <Download style={{ marginLeft: '8px' }} />
    </Button>
);

export const SansButtonAddData = ({ onClick }) => (
    <Button className='button-plus-1' variant='primary' onClick={onClick}>
        Add
        <PlusLg className='pluslg-custom-1' />
    </Button>
);

export const SansButtonAddLine = ({ onClick, disabled }) => (
    <Button className='button-plus' variant='success' onClick={onClick} disabled={disabled}>
        <PlusLg className='pluslg-custom' />
    </Button>
);