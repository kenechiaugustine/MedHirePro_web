import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import type { IApplicationResponse } from '../../redux/apis/applicationsApi/interface';

export function exportApplicantsToExcel(
    applications: IApplicationResponse[],
    jobTitle?: string
) {
    if (!applications || applications.length === 0) {
        toast.error("No applicant records available to export.");
        return;
    }

    try {
        const formattedData = applications.map((app, index) => {
            const candidate = app.candidate_details;
            const jobObj = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
            const positionTitle = jobTitle || jobObj?.position_title || 'N/A';

            return {
                'S/N': index + 1,
                'Candidate Name': candidate?.full_name || 'N/A',
                'Email Address': candidate?.email || 'N/A',
                'Clinical Specialty': candidate?.specialty || 'N/A',
                'License Number': candidate?.licence_number || 'N/A',
                'Verification Status': candidate?.is_verified ? 'Verified' : 'Unverified',
                'Current Workplace': candidate?.current_workplace || 'N/A',
                'Employment Status': candidate?.employment_status || 'N/A',
                'Job Title': positionTitle,
                'Job Type': app.vacancy_type || jobObj?.job_type || 'N/A',
                'Application Status': app.application_status || 'SUBMITTED',
                'Shortlisted': app.is_shortlisted ? 'Yes' : 'No',
                'Hired / Accepted': app.is_accepted ? 'Yes' : 'No',
                'Applied Date': app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : 'N/A',
                'Clinical Summary': app.clinical_summary || 'N/A',
                'CV Document URL': app.curriculum_vitae_url || 'N/A',
                'Supporting Documents': (app.credentialing_packet_urls || []).join(' | ') || 'N/A',
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Compute dynamic column widths
        const sampleRow = formattedData[0];
        const colWidths = Object.keys(sampleRow).map((key) => {
            const maxValLength = Math.max(
                key.length,
                ...formattedData.slice(0, 50).map((row) => String((row as any)[key] || '').length)
            );
            return { wch: Math.min(Math.max(maxValLength + 3, 12), 45) };
        });

        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');

        const cleanJobTitle = (jobTitle || 'Job')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 30);
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `${cleanJobTitle}_Applicants_${dateStr}.xlsx`;

        XLSX.writeFile(workbook, fileName);
        toast.success(`Exported ${applications.length} applicant(s) to Excel!`);
    } catch (err) {
        console.error('Failed to export Excel file:', err);
        toast.error('Failed to export applicants to Excel.');
    }
}
