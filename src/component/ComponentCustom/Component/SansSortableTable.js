import { useState,useMemo,useEffect } from 'react';
import { ChevronUp,ChevronDown } from 'react-bootstrap-icons';

const SansSortableTable = ({ data = [],defaultSort = '',type = 'ascending' }) =>
{
    const [sortConfig,setSortConfig] = useState({ key: defaultSort,direction: type });

    useEffect(() =>
    {
        if (defaultSort)
        {
            setSortConfig({ key: defaultSort,direction: type });
        }
    },[defaultSort,type]);

    const requestSort = (key) =>
    {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending')
        {
            direction = 'descending';
        }
        setSortConfig({ key,direction });
    };

    const sortedData = useMemo(() =>
    {
        let sortableItems = [...data];

        if (sortConfig.key)
        {
            sortableItems.sort((a,b) =>
            {
                const valueA = a[sortConfig.key] !== null ? a[sortConfig.key] : ''; // Replace null with an empty string
                const valueB = b[sortConfig.key] !== null ? b[sortConfig.key] : ''; // Replace null with an empty string

                if (valueA < valueB)
                {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB)
                {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    },[data,sortConfig]);

    const getSortIcon = (key) =>
    {
        if (sortConfig.key === key)
        {
            return sortConfig.direction === 'ascending' ? <ChevronUp /> : <ChevronDown />;
        }
        return <ChevronUp style={{ display: 'none' }} />;
    };

    return { sortedData,requestSort,getSortIcon,sortConfig };
};

export default SansSortableTable;
