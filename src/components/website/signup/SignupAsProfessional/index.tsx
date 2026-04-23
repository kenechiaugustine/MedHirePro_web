import { Link } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi';
import { MdWorkOutline } from 'react-icons/md';
import EmailInput from '../../../app/EmailInput';
import PasswordInput from '../../../app/PasswordInput';
import { WEBSITE_ROUTES } from '../../../../pages/website/routes.enum';
import docin from "../../../../assets/docin.png";

/* ✅ FULL DATA ADDED HERE */
const medicalData = {
  departments: [
    {
      id: "internal_medicine",
      name: "Internal Medicine",
      specialties: [
        "Cardiology","Nephrology","Gastroenterology","Endocrinology",
        "Neurology","Respiratory","Dermatology","Infectious Diseases"
      ]
    },
    
    {
      id: "surgery",
      name: "Surgery",
      specialties: [
        "General Surgery","Cardiothoracic Surgery","Neurosurgery",
        "Paediatric Surgery","Plastic & Reconstructive Surgery",
        "Urology","Orthopaedics & Trauma"
      ]
    },
    { id: "obgyn", name: "Obstetrics & Gynaecology", specialties: [] },
    {
      id: "paediatrics",
      name: "Paediatrics",
      specialties: ["General Paediatrics","Neonatology"]
    },
    {
      id: "family_medicine",
      name: "Family Medicine",
      specialties: ["General Practice","Primary Care"]
    },
    {
      id: "emergency_medicine",
      name: "Emergency Medicine",
      specialties: ["Accident & Emergency","Casualty"]
    },
    {
      id: "anaesthesia_icu",
      name: "Anaesthesia & Intensive Care",
      specialties: ["Anaesthesia","Intensive Care Unit","Pain Management"]
    },
    {
      id: "mental_health",
      name: "Mental Health",
      specialties: ["Psychiatry","Clinical Psychology"]
    },
    {
      id: "laboratory_pathology",
      name: "Laboratory / Pathology",
      specialties: [
        "Chemical Pathology","Haematology & Blood Transfusion",
        "Histopathology","Medical Microbiology","Immunology","Virology"
      ]
    },
    {
      id: "radiology",
      name: "Radiology & Imaging",
      specialties: [
        "Radiography","Radiology","Interventional Radiology",
        "Ultrasound","CT","MRI"
      ]
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      specialties: ["Clinical Pharmacy","Hospital Pharmacy","Pharmacology"]
    },
    {
      id: "nursing",
      name: "Nursing Services",
      specialties: [
        "General Nursing","Midwifery","Perioperative Nursing","ICU Nursing",
        "Paediatric Nursing","Public Health Nursing","Theatre Nursing",
        "Ophthalmic Nursing","Anaesthetic Nursing","Orthopaedic Nursing",
        "Psychiatric Nursing"
      ]
    },
    {
      id: "allied_health",
      name: "Allied Health Services",
      specialties: [
        "Physiotherapy","Occupational Therapy","Speech Therapy","Audiology",
        "Optometry","Ophthalmology","Dental","Dental Therapy",
        "Dental Technology","Dietetics & Nutrition","Medical Social Work"
      ]
    },
    {
      id: "public_health",
      name: "Public & Community Health",
      specialties: [
        "Public Health","Epidemiology","Environmental Health",
        "Community Health","CHEW","JCHEW"
      ]
    },
    {
      id: "administration",
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
    return (
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

                {/* LEFT SIDE unchanged */}
                <div className="hidden lg:flex flex-col">
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-[#0a192f] leading-tight tracking-tight mb-6">
                        Step into your <span className="text-[#0b5cd5]">next clinical role.</span>
                    </h1>

                    <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md">
                        Join Nigeria's elite network of healthcare professionals.
                    </p>

                    <div className="relative group rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(2,44,133,0.15)] mb-10 h-64 xl:h-80 w-full max-w-xl">
                        <img src={docin} alt="Doctor writing"
                            className="w-full h-full object-cover object-[50%_20%]" />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md mx-auto lg:mx-0">

                    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>

                        {/* NAME */}
                        <div>
                            <label className="text-[12px] font-bold text-[#0a192f]">Full Name</label>
                            <div className="relative flex items-center">
                                <HiOutlineUser className="absolute left-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Dr. Olumide Adeleke"
                                    className="w-full bg-[#f4f8fc] pl-10 py-3 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* ✅ SPECIALTY DROPDOWN (DYNAMIC) */}
                        <div>
                            <label className="text-[12px] font-bold text-[#0a192f]">
                                Primary Specialty
                            </label>

                            <div className="relative flex items-center">
                                <MdWorkOutline className="absolute left-3.5 text-slate-400" />

                                <select className="w-full bg-[#f4f8fc] pl-10 pr-8 py-3 rounded-lg">

                                    <option value="" disabled>
                                        Select your specialty
                                    </option>

                                    {medicalData.departments.map(dept => (
                                        dept.specialties.length > 0 && (
                                            <optgroup key={dept.id} label={dept.name}>
                                                {dept.specialties.map(spec => (
                                                    <option key={spec} value={spec}>
                                                        {spec}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )
                                    ))}

                                </select>
                            </div>
                        </div>

                        <EmailInput id="prof-email" label="Professional Email" />
                        <PasswordInput id="prof-password" label="Password" />

                        <button className="bg-[#033eb5] text-white py-3 rounded-lg">
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