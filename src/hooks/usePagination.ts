import { useState, useMemo } from 'react';

export function usePagination<T>(items: T[] = [], initialPageSize = 10) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const validCurrentPage = useMemo(() => {
        if (currentPage > totalPages) return totalPages;
        if (currentPage < 1) return 1;
        return currentPage;
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (validCurrentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, validCurrentPage, pageSize]);

    return {
        currentPage: validCurrentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        paginatedItems,
        totalPages,
        totalItems,
    };
}
