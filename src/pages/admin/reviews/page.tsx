import { useState } from 'react';
import { 
    useGetReviewsQuery, 
    useUpdateReviewVisibilityMutation 
} from '../../../redux/apis/reviewsApi';
import { FiLoader, FiStar, FiFilter, FiAlertCircle, FiGlobe, FiLock } from 'react-icons/fi';
import { Avatar } from '../../../components/app';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
    const { data: reviewsRes, isLoading, error, refetch } = useGetReviewsQuery();
    const reviews = reviewsRes?.data || [];
    const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
    const [roleFilter, setRoleFilter] = useState<'professional' | 'institute' | 'ALL'>('ALL');
    
    const [updateReviewVisibility] = useUpdateReviewVisibilityMutation();

    const handleToggleVisibility = async (reviewId: string, currentPublic: boolean) => {
        try {
            await updateReviewVisibility({ review_id: reviewId, is_public: !currentPublic }).unwrap();
            toast.success(`Review visibility set to ${!currentPublic ? 'Public' : 'Private'}.`);
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to update review visibility.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-655" />
                    <p className="text-slate-500 font-medium text-xs">Loading platform reviews...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto text-2xl">
                    <FiAlertCircle />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Connection Failed</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                        Could not retrieve reviews database entries. Please check your connections.
                    </p>
                </div>
                <button 
                    onClick={() => refetch()}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    Retry Query
                </button>
            </div>
        );
    }

    const allReviews = reviews || [];
    
    // Metrics
    const totalCount = allReviews.length;
    const avgRating = totalCount > 0 
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) 
        : '0.0';
    const profCount = allReviews.filter(r => r.user_details?.role === 'professional').length;
    const instCount = allReviews.filter(r => r.user_details?.role === 'institute').length;

    // Filtering
    const filteredReviews = allReviews.filter(review => {
        if (ratingFilter !== 'ALL' && review.rating !== ratingFilter) return false;
        if (roleFilter !== 'ALL' && review.user_details?.role !== roleFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 animate-fadeIn duration-200">
            {/* Header section */}
            <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Platform Reviews</h1>
                <p className="text-xs text-slate-450 font-medium">Monitor user experiences and platform ratings.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Star Rating</span>
                    <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-2xl font-black text-slate-800">{avgRating}</span>
                        <div className="flex items-center text-amber-500 text-sm">
                            <FiStar className="fill-current text-amber-500" />
                            <span className="text-[11px] font-bold text-slate-450 ml-1">/ 5.0 rating</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                    <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-2xl font-black text-slate-800">{totalCount}</span>
                        <span className="text-[11px] text-slate-400 font-bold">reviews submitted</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Professional Reviews</span>
                    <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-2xl font-black text-teal-600">{profCount}</span>
                        <span className="text-[11px] text-slate-400 font-bold">from candidates</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institute Reviews</span>
                    <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-2xl font-black text-indigo-650">{instCount}</span>
                        <span className="text-[11px] text-slate-400 font-bold">from medical institutions</span>
                    </div>
                </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap gap-4 items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><FiFilter /> Filters</span>
                
                <div className="flex flex-wrap gap-3">
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-455 font-semibold text-slate-650 cursor-pointer"
                    >
                        <option value="ALL">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-455 font-semibold text-slate-655 cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="professional">Professionals</option>
                        <option value="institute">Institutions</option>
                    </select>
                </div>
            </div>

            {/* Reviews display list */}
            {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center space-y-4 max-w-2xl mx-auto">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl border border-slate-100">
                        <FiStar />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-extrabold text-slate-800">No Reviews Found</h3>
                        <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">
                            No review submissions match your current filters or roles settings.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReviews.map((review) => {
                        const userDetails = review.user_details;
                        const userRole = userDetails?.role || 'professional';
                        const displayName = userRole === 'institute' 
                            ? (userDetails?.facility_name || 'Medical Facility')
                            : (userDetails?.full_name || 'Anonymous Practitioner');

                        return (
                            <div key={review._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div className="space-y-3">
                                    {/* User header info */}
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={displayName}
                                                avatarUrl={userDetails?.avatar_url}
                                                size="sm"
                                                role={userRole}
                                            />
                                            <div>
                                                <h4 className="font-extrabold text-slate-800 text-sm leading-tight truncate max-w-[180px]" title={displayName}>
                                                    {displayName}
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                                    {userRole}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-0.5 text-amber-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FiStar 
                                                    key={i} 
                                                    className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current text-amber-500' : 'text-slate-200'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review text */}
                                    <p className="text-xs text-slate-600 font-semibold leading-relaxed whitespace-pre-line">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="border-t border-slate-50 pt-3.5 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                    <div className="flex flex-col space-y-0.5">
                                        <span>UID: #{review.user_id.slice(-6).toUpperCase()}</span>
                                        <span>{new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleToggleVisibility(review._id, review.is_public)}
                                        className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                                            review.is_public
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                                        }`}
                                    >
                                        {review.is_public ? (
                                            <>
                                                <FiGlobe className="text-xs text-emerald-500" /> Public
                                            </>
                                        ) : (
                                            <>
                                                <FiLock className="text-xs text-slate-400" /> Private
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
