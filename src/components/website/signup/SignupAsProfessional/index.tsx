import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi';
import { MdWorkOutline } from 'react-icons/md';
import EmailInput from '../../../app/EmailInput';
import PasswordInput from '../../../app/PasswordInput';
import { WEBSITE_ROUTES } from '../../../../pages/website/routes.enum';
import docin from "../../../../assets/docin.png";

/* ✅ TYPE */
type Specialty = {
  name: string;
  department: string;
};

/* ✅ FULL DATA */
const medicalData = {
  departments: [
    {
      name: "Internal Medicine",
      specialties: [
        "Cardiology","Nephrology","Gastroenterology","Endocrinology",
        "Neurology","Respiratory","Dermatology","Infectious Diseases"
      ]
    },
    {
      name: "Surgery",
      specialties: [
        "General Surgery","Cardiothoracic Surgery","Neurosurgery",
        "Paediatric Surgery","Plastic & Reconstructive Surgery",
        "Urology","Orthopaedics & Trauma"
      ]
    },
    {
      name: "Obstetrics & Gynaecology",
      specialties: []
    },
    {
      name: "Paediatrics",
      specialties: ["General Paediatrics","Neonatology"]
    },
    {
      name: "Family Medicine",
      specialties: ["General Practice","Primary Care"]
    },
    {
      name: "Emergency Medicine",
      specialties: ["Accident & Emergency","Casualty"]
    },
    {
      name: "Anaesthesia & Intensive Care",
      specialties: ["Anaesthesia","Intensive Care Unit","Pain Management"]
    },
    {
      name: "Mental Health",
      specialties: ["Psychiatry","Clinical Psychology"]
    },
    {
      name: "Laboratory / Pathology",
      specialties: [
        "Chemical Pathology","Haematology & Blood Transfusion",
        "Histopathology","Medical Microbiology","Immunology","Virology"
      ]
    },
    {
      name: "Radiology & Imaging",
      specialties: [
        "Radiography","Radiology","Interventional Radiology",
        "Ultrasound","CT","MRI"
      ]
    },
    {
      name: "Pharmacy",
      specialties: ["Clinical Pharmacy","Hospital Pharmacy","Pharmacology"]
    },
    {
      name: "Nursing Services",
      specialties: [
        "General Nursing","Midwifery","Perioperative Nursing","ICU Nursing",
        "Paediatric Nursing","Public Health Nursing","Theatre Nursing",
        "Ophthalmic Nursing","Anaesthetic Nursing","Orthopaedic Nursing",
        "Psychiatric Nursing"
      ]
    },
    {
      name: "Allied Health Services",
      specialties: [
        "Physiotherapy","Occupational Therapy","Speech Therapy","Audiology",
        "Optometry","Ophthalmology","Dental","Dental Therapy",
        "Dental Technology","Dietetics & Nutrition","Medical Social Work"
      ]
    },
    {
      name: "Public & Community Health",
      specialties: [
        "Public Health","Epidemiology","Environmental Health",
        "Community Health","CHEW","JCHEW"
      ]
    },
    {
      name: "Administration & Support",
      specialties: [
        "Health Information Management","Hospital Administration",
        "Human Resources","Finance","ICT / Health Informatics",
        "Biomedical Engineering"
      ]
    }
  ]
};

const SignupAsProfessional = () => {
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<Specialty | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const ref = useRef<HTMLDivElement | null>(null);

  /* 🔥 FLATTEN ALL SPECIALTIES */
  const specialties: Specialty[] = medicalData.departments.flatMap(dept =>
    dept.specialties.map(spec => ({
      name: spec,
      department: dept.name
    }))
  );

  /* 🔍 FILTER */
  const filtered = specialties.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  /* 👇 CLICK OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-10 w-full max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-4xl font-extrabold text-[#0a192f] mb-6">
            Step into your <span className="text-[#0b5cd5]">next clinical role.</span>
          </h1>
          <img src={docin} className="rounded-2xl" alt="Doctor writing" />
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl p-8 shadow border w-full max-w-md mx-auto">

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>

            {/* NAME */}
            <div>
              <label className="text-xs font-bold">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-3 text-gray-400" />
                <input type="text" className="w-full pl-10 py-3 bg-[#f4f8fc] rounded-lg" />
              </div>
            </div>

            {/* 🔥 SEARCHABLE SPECIALTY */}
            <div ref={ref}>
              <label className="text-xs font-bold">Primary Specialty</label>

              <div className="relative">
                <MdWorkOutline className="absolute left-3 top-3 text-gray-400 z-10" />

                <input
                  type="text"
                  value={selected ? selected.name : query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                    setIsOpen(true);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => {
                    if (!isOpen) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
                    }

                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex(prev => Math.max(prev - 1, 0));
                    }

                    if (e.key === "Enter" && activeIndex >= 0) {
                      e.preventDefault();
                      const item = filtered[activeIndex];
                      if (item) {
                        setSelected(item);
                        setIsOpen(false);
                        setQuery('');
                      }
                    }
                  }}
                  placeholder="Search specialty..."
                  className="w-full pl-10 pr-8 py-3 bg-[#f4f8fc] rounded-lg outline-none"
                />

                {isOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto">

                    {filtered.length > 0 ? (
                      filtered.map((item, i) => (
                        <div
                          key={`${item.name}-${i}`}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => {
                            setSelected(item);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`px-4 py-2 flex justify-between cursor-pointer ${
                            i === activeIndex
                              ? "bg-[#0b5cd5]/10"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span>{item.name}</span>
                          <span className="text-xs text-gray-400">
                            {item.department}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-400">
                        No specialties found
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>

            <EmailInput id="prof-email" label="Professional Email" />
            <PasswordInput id="prof-password" label="Password" />

            <button type="submit" className="bg-[#033eb5] text-white py-3 rounded-lg">
              Create Professional Account
            </button>

            <p className="text-xs text-center text-gray-400">
              <Link to={WEBSITE_ROUTES.TERMS}>Terms</Link> •{" "}
              <Link to={WEBSITE_ROUTES.PRIVACY}>Privacy</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupAsProfessional;