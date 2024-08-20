import React,{ useState } from 'react';
import { PersonCircle,PersonSquare } from 'react-bootstrap-icons';

const SansLoadOrNotImage = ({ src,width,height,shape = 'circle',onError = () => { } }) =>
{
    const [hasError,setHasError] = useState(false);

    const handleError = () =>
    {
        setHasError(true);
        onError();
    };

    const renderFallback = () =>
    {
        const fallbackStyle = { width,height,color: '#dee2e6',borderRadius: shape === 'square' ? '5%' : '50%' };
        return shape === 'circle' ? (
            <PersonCircle style={fallbackStyle} />
        ) : (
            <PersonSquare style={fallbackStyle} />
        );
    };

    return (
        <>
            {src && !hasError ? (
                <img
                    src={src}
                    alt="User"
                    style={{ width,height,borderRadius: shape === 'circle' ? '50%' : '5%' }}
                    onError={handleError}
                />
            ) : (
                renderFallback()
            )}
        </>
    );
};

export default SansLoadOrNotImage;
