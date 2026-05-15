import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDomain } from 'react-icons/md';
import { EmailInput, PasswordInput } from '../../../app';
import { WEBSITE_ROUTES } from '../../../../pages/website/routes.enum';
import { useAuth } from '../../../../hooks/useAuth';
import toast from 'react-hot-toast';

const SignupAsInstitute = () => {
    const [facilityName, setFacilityName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [touched, setTouched] = useState({ facilityName: false, email: false, password: false });
    const [submitted, setSubmitted] = useState(false);

    const getError = (field: 'facilityName' | 'email' | 'password', value: string) => {
        if ((touched[field] || submitted) && !value) {
            return 'This field is required';
        }
        if (field === 'email' && value && (touched[field] || submitted)) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }
        if (field === 'password' && value && (touched[field] || submitted)) {
            if (value.length < 5) {
                return 'Password must be at least 5 characters';
            }
        }
        return undefined;
    };
    
    const { signUpAsInstitute, loading } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const facilityNameError = getError('facilityName', facilityName);
        const emailError = getError('email', email);
        const passwordError = getError('password', password);

        if (facilityNameError || emailError || passwordError) {
            toast.error('Please fix the errors in the form');
            return;
        }
        try {
            await signUpAsInstitute(email, password, facilityName);
            toast.success('Account created successfully! Welcome to MedHirePro.');
            navigate('/client');
        } catch (err: any) {
            toast.error(err.message || 'Failed to create account');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

                {/* Left Side: Info & Image — hidden on small screens */}
                <div className="hidden lg:flex flex-col">
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-[#0a192f] leading-[1.15] tracking-tight mb-6">
                        Build your <span className="text-[#4631ab]">world-class</span> clinical team.
                    </h1>
                    <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md">
                        Get instant access to Nigeria's largest pre-vetted network of healthcare professionals ready to deploy.
                    </p>

                    <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8 h-64 xl:h-72 w-full max-w-lg">
                        <img
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                            alt="Hospital Building"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex gap-12">
                        <div>
                            <div className="text-2xl font-extrabold text-[#4631ab]">500+</div>
                            <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Partner Hospitals</div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-[#066b77]">12k+</div>
                            <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Verified Clinicians</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md mx-auto lg:mx-0">

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#edeafe] text-[#4631ab] text-[10px] font-bold tracking-widest uppercase mb-6">
                        <MdDomain className="w-3.5 h-3.5" /> Healthcare Institution
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] mb-2">Register your facility</h2>
                    <p className="text-slate-500 text-sm mb-6 sm:mb-8">Enter your organization details to begin.</p>

                    <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>

                        {/* Facility Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="inst-facility" className="text-[12px] font-bold text-[#0a192f]">Facility Name</label>
                            <div className={`relative flex items-center ${getError('facilityName', facilityName) ? 'animate-shake' : ''}`}>
                                <MdDomain className={`absolute left-3.5 text-lg pointer-events-none ${getError('facilityName', facilityName) ? 'text-red-400' : 'text-slate-400'}`} />
                                <input
                                    id="inst-facility"
                                    type="text"
                                    placeholder="St. Nicholas Hospital"
                                    value={facilityName}
                                    onChange={(e) => setFacilityName(e.target.value)}
                                    onBlur={() => setTouched((prev) => ({ ...prev, facilityName: true }))}
                                    className={`w-full text-[14px] text-slate-700 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:bg-white transition-all border ${getError('facilityName', facilityName) ? 'border-red-500 bg-red-50/30 focus:ring-red-500/20 focus:border-red-500/30' : 'bg-[#f4f8fc] border-transparent focus:ring-[#4631ab]/20 focus:border-[#4631ab]/30'}`}
                                />
                            </div>
                            {getError('facilityName', facilityName) && (
                                <span className="text-[11px] text-red-500 font-medium">{getError('facilityName', facilityName)}</span>
                            )}
                        </div>

                        {/* Email — shared component */}
                        <EmailInput
                            id="inst-email"
                            label="Official Email"
                            placeholder="hr@hospital.ng"
                            focusColor="#4631ab"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            error={getError('email', email)}
                        />

                        {/* Password — shared component */}
                        <PasswordInput
                            id="inst-password"
                            label="Password"
                            focusColor="#4631ab"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                            error={getError('password', password)}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4631ab] hover:bg-[#32237a] text-white font-medium py-3.5 rounded-lg mt-1 sm:mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Institution Account'}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 mt-1 sm:mt-2 px-2 sm:px-4 leading-relaxed">
                            By signing up, you agree to our{' '}
                            <Link to={WEBSITE_ROUTES.TERMS} className="text-[#4631ab] hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to={WEBSITE_ROUTES.PRIVACY} className="text-[#4631ab] hover:underline">Privacy Policy</Link>.
                        </p>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default SignupAsInstitute;