import { Link } from 'react-router-dom';
import { WEBSITE_ROUTES } from '../../pages/website/routes.enum';

const Footer = () => {
    // Define footer links for easy maintenance
    const footerLinks = [
        { name: 'For Professionals', path: WEBSITE_ROUTES.PROFESSIONAL },
        { name: 'For Institutes', path: WEBSITE_ROUTES.INSTITUTE },
        { name: 'About us', path: WEBSITE_ROUTES.ABOUT },
        { name: 'Contact us', path: WEBSITE_ROUTES.CONTACT },
        { name: 'Privacy Policy', path: WEBSITE_ROUTES.PRIVACY },
        { name: 'Terms of Service', path: WEBSITE_ROUTES.TERMS },
    ];

    // Get current year for dynamic copyright
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#f6f8fb] py-8 md:py-10 border-t border-gray-100">
            {/* Container matching Navbar width */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Flex Layout */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">

                    {/* Left Side: Brand and Copyright */}
                    <div className="flex flex-col space-y-2">
                        <Link to={WEBSITE_ROUTES.HOME} className="text-slate-800 font-bold text-lg tracking-tight">
                            MedHirePro
                        </Link>
                        <p className="text-slate-500 text-[14px]">
                            © {currentYear} MedHirePro Precision healthcare staffing.
                        </p>
                    </div>

                    {/* Right Side: Navigation Links */}
                    <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-3">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[14px] text-slate-500 hover:text-[#0d47a1] font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;