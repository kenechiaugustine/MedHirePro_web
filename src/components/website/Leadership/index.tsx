import { Link } from 'react-router-dom';
// import { BsLink45Deg } from 'react-icons/bs';
// add a link icon 
import { BsLink45Deg } from 'react-icons/bs';
import { HiArrowRight } from 'react-icons/hi';
import ChibuikeImg from '../../../assets/myprofilepicture.png';
import KeneImg from '../../../assets/Kene.jpeg';
import advisor from '../../../assets/advisor.jpg'

const Leadership = () => {
    const leaders = {
        ceo: {
            name: 'Mls. Obasi Chibuike',
            role: 'FOUNDER ',
            bio: '"Our mission is to ensure no hospital operates below its highest potential."',
            linkedin: 'https://www.linkedin.com/in/chibuike-obasi-aa1169218',
            image: ChibuikeImg,
        },
        cto: {
            name: 'Arionye Kenechukwu',
            role: 'CHIEF TECHNOLOGY OFFICER',
            linkedin: 'https://www.linkedin.com/in/kenechukwu-arionye-57759722a/',
            image: KeneImg,
        },
        advisor: {
            name: 'Dr. James Kalu',
            role: 'MEDICAL ADVISOR',
            linkedin: 'https://linkedin.com',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        }
    };

    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-12 gap-4">
                    <div>
                        <span className="text-[#0b5cd5] text-xs font-bold tracking-widest uppercase">Leadership</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] mt-2">Architects of the Future</h2>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-md lg:text-right">
                        Combining 8+ years of healthcare logistics and software engineering.
                    </p>
                </div>

                {/* Grid Layout */}
                {/* 
                  - Default: 1 column (below 484px)
                  - min-[484px]: 2 columns
                  - lg: 6 columns 
                */}
                <div className="grid grid-cols-1 min-[484px]:grid-cols-2 lg:grid-cols-6 gap-6">

                    {/* CEO CARD */}
                    <a
                        href={leaders.ceo.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-1 min-[484px]:col-span-2 lg:col-span-4 bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow group min-h-[500px] sm:min-h-0 relative sm:relative"
                    >
                        {/* Mobile: full-bleed image */}
                        <div className="absolute inset-0 sm:hidden">
                            <img src={leaders.ceo.image} alt={leaders.ceo.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        {/* Mobile: text pinned to bottom with gradient */}
                        <div className="absolute bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-20 rounded-b-[2rem]">
                            <span className="text-blue-300 text-[11px] font-bold tracking-wider uppercase mb-2 block">{leaders.ceo.role}</span>
                            <h3 className="text-2xl font-bold text-white mb-2">{leaders.ceo.name}</h3>
                            <p className="text-white/70 italic text-[14px] leading-relaxed">{leaders.ceo.bio}</p>
                        </div>

                        {/* sm+: original side-by-side layout */}
                        <div className="hidden sm:block sm:w-2/5 lg:h-auto overflow-hidden flex-shrink-0 self-stretch">
                            <img src={leaders.ceo.image} alt={leaders.ceo.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="hidden sm:flex p-8 sm:p-10 flex-col justify-center w-full sm:w-3/5">
                            <span className="text-[#0b5cd5] text-[11px] font-bold tracking-wider uppercase mb-2">{leaders.ceo.role}</span>
                            <h3 className="text-2xl font-bold text-[#0a192f] mb-4">{leaders.ceo.name}</h3>
                            <p className="text-slate-500 italic text-[15px] leading-relaxed mb-6">{leaders.ceo.bio}</p>
                            <BsLink45Deg className="text-gray-400 text-2xl" />
                        </div>
                    </a>

                    {/* CTO CARD */}
                    <a
                        href={leaders.cto.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-1 min-[484px]:row-span-2 lg:row-span-1 lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] overflow-hidden relative flex flex-col shadow-sm hover:shadow-md transition-shadow group min-h-[420px]"
                    >
                        {/* Image fills the entire card */}
                        <div className="absolute inset-0">
                            <img src={leaders.cto.image} alt={leaders.cto.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        {/* Text pinned to the bottom with a gradient overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-16 rounded-b-[2rem]">
                            <span className="text-indigo-300 text-[11px] font-bold tracking-wider uppercase mb-1 block">{leaders.cto.role}</span>
                            <h3 className="text-xl font-bold text-white">{leaders.cto.name}</h3>
                        </div>
                    </a>

                    {/* ADVISOR CARD */}
                    <a
                        href={leaders.advisor.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-1 lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-50">
                            <img src={advisor} alt={leaders.advisor.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[#066b77] text-[11px] font-bold tracking-wider uppercase mb-1">{leaders.advisor.role}</span>
                        <h3 className="text-xl font-bold text-[#0a192f]">{leaders.advisor.name}</h3>
                    </a>

                    {/* JOIN BOARD CARD */}
                    <div className="col-span-1 lg:col-span-4 bg-[#eaf1ff] rounded-[2rem] p-8 sm:p-10 flex flex-col justify-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1e3a8a] mb-3">Join our Board of Advisors</h3>
                        <p className="text-[#1e3a8a]/70 text-sm sm:text-base mb-6 max-w-lg">
                            We are always looking for visionary clinical leaders and technology pioneers to help shape the next decade of healthcare staffing.
                        </p>
                        <Link to="/contact" className="flex items-center gap-2 text-[#0b5cd5] font-bold hover:gap-3 transition-all">
                            Contact us <HiArrowRight />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Leadership;