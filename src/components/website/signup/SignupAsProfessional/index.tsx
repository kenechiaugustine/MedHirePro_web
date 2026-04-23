import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi';
import { MdWorkOutline } from 'react-icons/md';

// ❗ TEMP: remove fragile imports until confirmed
// import EmailInput from '../../../app/EmailInput';
// import PasswordInput from '../../../app/PasswordInput';
// import { WEBSITE_ROUTES } from '../../../../pages/website/routes.enum';
// import docin from "../../../../assets/docin.png";

/* SAFE FALLBACK */
const WEBSITE_ROUTES = {
  TERMS: "/terms",
  PRIVACY: "/privacy"
};

const SignupAsProfessional = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef(null);

  const specialties = [
    { name: "Cardiology", department: "Internal Medicine" },
    { name: "Neurology", department: "Internal Medicine" },
    { name: "General Surgery", department: "Surgery" },
    { name: "Paediatrics", department: "Paediatrics" },
    { name: "Psychiatry", department: "Mental Health" }
  ];

  const filtered = specialties.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">

        <form className="flex flex-col gap-5">

          {/* NAME */}
          <div>
            <label className="text-xs font-bold">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-3 text-gray-400" />
              <input className="w-full pl-10 py-3 bg-gray-100 rounded-lg" />
            </div>
          </div>

          {/* SEARCHABLE SPECIALTY */}
          <div ref={ref}>
            <label className="text-xs font-bold">Primary Specialty</label>

            <div className="relative">
              <MdWorkOutline className="absolute left-3 top-3 text-gray-400" />

              <input
                value={selected ? selected.name : query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                  setIsOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search specialty..."
                className="w-full pl-10 py-3 bg-gray-100 rounded-lg"
              />

              {isOpen && (
                <div className="absolute mt-2 w-full bg-white border rounded shadow">

                  {filtered.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelected(item);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>

          {/* SIMPLE INPUTS (safe fallback) */}
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-100 p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-gray-100 p-3 rounded"
          />

          <button className="bg-blue-600 text-white py-3 rounded">
            Create Account
          </button>

          <p className="text-xs text-center text-gray-400">
            <Link to={WEBSITE_ROUTES.TERMS}>Terms</Link> •{" "}
            <Link to={WEBSITE_ROUTES.PRIVACY}>Privacy</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default SignupAsProfessional;