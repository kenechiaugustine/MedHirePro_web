import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showRangeText?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50, 100],
    className = '',
    showRangeText = true,
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

    // Generate page numbers array with ellipsis if needed for larger screens
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include page 1
            pages.push(1);

            let start = Math.max(2, safeCurrentPage - 1);
            let end = Math.min(totalPages - 1, safeCurrentPage + 1);

            if (safeCurrentPage <= 2) {
                end = 4;
            } else if (safeCurrentPage >= totalPages - 1) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always include last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-50/90 border-t border-slate-150 text-xs ${className}`}>
            {/* Top (Mobile) / Left (Desktop): Per page selector & Range Info */}
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 text-slate-600 font-medium">
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Per page</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                onPageSizeChange(Number(e.target.value));
                                onPageChange(1); // Reset to page 1 on page size change
                            }}
                            className="bg-white border border-slate-250 hover:border-slate-350 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-2xs cursor-pointer transition-colors"
                        >
                            {pageSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {showRangeText && (
                    <div className="text-[11px] font-bold text-slate-500">
                        {totalItems > 0 ? (
                            <>
                                <span className="hidden xs:inline">Showing </span>
                                <span className="font-extrabold text-slate-800">{startItem}-{endItem}</span> of{' '}
                                <span className="font-extrabold text-slate-800">{totalItems}</span>
                            </>
                        ) : (
                            'No items'
                        )}
                    </div>
                )}
            </div>

            {/* Bottom (Mobile) / Right (Desktop): Page Navigation */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                {/* Prev Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer transition-colors shadow-2xs text-xs"
                    aria-label="Previous Page"
                >
                    <FiChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Mobile Compact Page Indicator */}
                <div className="sm:hidden font-extrabold text-slate-700 text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md shadow-2xs">
                    {safeCurrentPage} / {totalPages}
                </div>

                {/* Desktop Full Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (typeof page === 'string') {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold text-xs select-none">
                                    ...
                                </span>
                            );
                        }

                        const isActive = page === safeCurrentPage;
                        return (
                            <button
                                key={`page-${page}`}
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`min-w-[32px] h-[32px] px-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center ${
                                    isActive
                                        ? 'bg-teal-600 text-white shadow-xs border border-teal-600 scale-105'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer transition-colors shadow-2xs text-xs"
                    aria-label="Next Page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
