import { useState } from 'react';
import { useSubmitReviewMutation } from '../../../redux/apis/reviewsApi';
import { FiStar, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserSubmitReviewPage() {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [submitReview, { isLoading }] = useSubmitReviewMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating first.");
            return;
        }
        if (!comment.trim() || comment.trim().length < 5) {
            toast.error("Feedback description must be at least 5 characters long.");
            return;
        }

        try {
            await submitReview({ rating, comment: comment.trim() }).unwrap();
            toast.success("Thank you for your feedback!");
            setComment('');
            setSubmitted(true);
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to submit review.");
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto my-12 bg-white border border-slate-100 shadow-md rounded-2xl p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto text-3xl">
                    <FiCheckCircle className="animate-bounce" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-800">Feedback Submitted Successfully!</h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
                        Your response has been received. Our administration team reviews all feedback weekly to enhance our clinical registry services.
                    </p>
                </div>
                <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-slate-850 hover:bg-slate-750 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    Submit Another Review
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto my-6 bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Submit Platform Review</h3>
                    <p className="text-xs text-slate-400 font-semibold">
                        Help us improve your clinical staffing and job placement experience.
                    </p>
                </div>

                {/* Star rating selector */}
                <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tap to Rate MedHirePro
                    </span>
                    <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, idx) => {
                            const currentVal = idx + 1;
                            const isStarred = currentVal <= (hoverRating ?? rating);
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setRating(currentVal)}
                                    onMouseEnter={() => setHoverRating(currentVal)}
                                    onMouseLeave={() => setHoverRating(null)}
                                    className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <FiStar 
                                        className={`w-7 h-7 transition-colors duration-150 ${
                                            isStarred 
                                                ? 'fill-current text-amber-500' 
                                                : 'text-slate-300'
                                        }`} 
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <span className="text-xs font-bold text-slate-600 mt-1">
                        {rating === 0 ? 'Select a rating' :
                         rating === 5 ? 'Excellent!' :
                         rating === 4 ? 'Great Experience' :
                         rating === 3 ? 'Good / Average' :
                         rating === 2 ? 'Needs Improvement' : 'Disappointing'}
                    </span>
                </div>

                {/* Comment area */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Detailed Feedback & Comments
                    </label>
                    <textarea
                        rows={5}
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you like about MedHirePro or what we can improve (e.g. credential checks, shift booking, credit operations)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700 placeholder-slate-400 resize-none"
                    />
                </div>

                {/* Action button */}
                <button
                    type="submit"
                    disabled={isLoading || rating === 0 || !comment.trim() || comment.trim().length < 5}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                    {isLoading ? (
                        <FiLoader className="animate-spin" />
                    ) : (
                        <FiSend />
                    )}
                    Send Platform Review
                </button>
            </form>
        </div>
    );
}
