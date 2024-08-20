import { useState,useMemo } from 'react';
import { ChevronUp,ChevronDown } from 'react-bootstrap-icons';

const SansSortableTable = (initialData) =>
{
    const [sortConfig,setSortConfig] = useState({ key: '',direction: '' });

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
        let sortableItems = [...initialData];
        if (sortConfig.key)
        {
            sortableItems.sort((a,b) =>
            {
                if (a[sortConfig.key] < b[sortConfig.key])
                {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key])
                {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    },[initialData,sortConfig]);

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
