import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  ScholarshipFormData,
  FormErrors,
  SubmissionReceipt
} from '../types/scholarship';
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  UploadCloud,
  FileCheck,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const INITIAL_FORM_DATA: ScholarshipFormData = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  collegeName: '',
  university: '',
  currentYear: '',
  branch: '',
  cgpa: '',
  familyIncome: '',
  category: '',
  scholarshipType: '',
  statementOfPurpose: '',
  incomeCertificate: null,
  marksheet: null,
  declared: false
};

interface ScholarshipFormProps {
  onFormSubmitted?: (receipt: SubmissionReceipt) => void;
}

export const ScholarshipForm: React.FC<ScholarshipFormProps> = ({ onFormSubmitted }) => {
  const [formData, setFormData] = useState<ScholarshipFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [isAiGeneratingSop, setIsAiGeneratingSop] = useState(false);

  // Field change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error on change
    if (errors[name as keyof ScholarshipFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // File upload handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'incomeCertificate' | 'marksheet') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, [field]: file }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form Validation logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s\-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender';

    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.university.trim()) newErrors.university = 'University is required';
    if (!formData.currentYear) newErrors.currentYear = 'Please select current year of study';
    if (!formData.branch.trim()) newErrors.branch = 'Branch / Specialization is required';
    if (!formData.cgpa.trim()) {
      newErrors.cgpa = 'CGPA is required';
    } else {
      const val = parseFloat(formData.cgpa);
      if (isNaN(val) || val < 0 || val > 10) {
        newErrors.cgpa = 'CGPA must be between 0.0 and 10.0';
      }
    }

    if (!formData.familyIncome.trim()) {
      newErrors.familyIncome = 'Annual family income is required';
    } else if (isNaN(Number(formData.familyIncome)) || Number(formData.familyIncome) < 0) {
      newErrors.familyIncome = 'Income must be a valid positive number';
    }
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.scholarshipType) newErrors.scholarshipType = 'Please select a scholarship type';

    if (!formData.statementOfPurpose.trim()) {
      newErrors.statementOfPurpose = 'Statement of Purpose is required';
    } else if (formData.statementOfPurpose.trim().length < 50) {
      newErrors.statementOfPurpose = 'SOP should be at least 50 characters long';
    }

    if (!formData.incomeCertificate) newErrors.incomeCertificate = 'Please upload your Income Certificate';
    if (!formData.marksheet) newErrors.marksheet = 'Please upload your Marksheet';
    if (!formData.declared) newErrors.declared = 'You must accept the declaration to proceed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form handler
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  };

  // Submit form handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementsByName(firstErrorKey)[0];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate server processing delay
    setTimeout(() => {
      const newReceipt: SubmissionReceipt = {
        applicationId: `SCH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toLocaleString(),
        data: { ...formData }
      };

      setReceipt(newReceipt);
      setIsSubmitting(false);

      if (onFormSubmitted) {
        onFormSubmitted(newReceipt);
      }
    }, 1200);
  };

  // AI SOP Generation Assistant helper
  const handleGenerateAiSop = () => {
    setIsAiGeneratingSop(true);
    setTimeout(() => {
      const field = formData.branch || 'Computer Science';
      const year = formData.currentYear || '3rd Year';
      const college = formData.collegeName || 'Institute of Technology';
      const type = formData.scholarshipType || 'Merit-Based Academic Excellence';

      const draftSop = `I am a dedicated ${year} student pursuing my degree in ${field} at ${college}. Throughout my academic journey, I have maintained a strong commitment to scholastic excellence and hands-on project work. Applying for the ${type} will provide crucial financial support to cover tuition fees and technical resource subscriptions, enabling me to focus on research and community innovation. I am eager to leverage this grant to achieve my career aspirations in AI engineering.`;

      setFormData(prev => ({ ...prev, statementOfPurpose: draftSop }));
      setIsAiGeneratingSop(false);
      if (errors.statementOfPurpose) {
        setErrors(prev => ({ ...prev, statementOfPurpose: undefined }));
      }
    }, 900);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.7))',
        borderLeft: '4px solid var(--accent-cyan)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              <GraduationCap size={14} /> Official Application Portal — Academic Year 2026-27
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              Scholarship <span className="gradient-text">Application Form</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Please fill in your academic, personal, and financial details accurately before submitting.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-emerald">
              <ShieldCheck size={13} /> SSL Secured
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: Personal Information */}
        <div className="form-section">
          <div className="form-section-title">
            <User size={20} color="var(--accent-cyan)" />
            <span>1. Personal Details</span>
          </div>

          <div className="form-grid-2">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                <span>Full Name <span className="required">*</span></span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Adarsh Sharma"
                className={`form-input ${errors.fullName ? 'has-error' : ''}`}
              />
              {errors.fullName && <div className="error-text"><AlertCircle size={12} /> {errors.fullName}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <span>Email Address <span className="required">*</span></span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
              />
              {errors.email && <div className="error-text"><AlertCircle size={12} /> {errors.email}</div>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">
                <span>Phone Number <span className="required">*</span></span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
              />
              {errors.phone && <div className="error-text"><AlertCircle size={12} /> {errors.phone}</div>}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">
                <span>Date of Birth <span className="required">*</span></span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`form-input ${errors.dob ? 'has-error' : ''}`}
              />
              {errors.dob && <div className="error-text"><AlertCircle size={12} /> {errors.dob}</div>}
            </div>

            {/* Gender */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <span>Gender <span className="required">*</span></span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-select ${errors.gender ? 'has-error' : ''}`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <div className="error-text"><AlertCircle size={12} /> {errors.gender}</div>}
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Credentials */}
        <div className="form-section">
          <div className="form-section-title">
            <BookOpen size={20} color="var(--accent-purple)" />
            <span>2. Academic Credentials</span>
          </div>

          <div className="form-grid-2">
            {/* College Name */}
            <div className="form-group">
              <label className="form-label">
                <span>College Name <span className="required">*</span></span>
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                className={`form-input ${errors.collegeName ? 'has-error' : ''}`}
              />
              {errors.collegeName && <div className="error-text"><AlertCircle size={12} /> {errors.collegeName}</div>}
            </div>

            {/* University */}
            <div className="form-group">
              <label className="form-label">
                <span>University <span className="required">*</span></span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g. State Technological University"
                className={`form-input ${errors.university ? 'has-error' : ''}`}
              />
              {errors.university && <div className="error-text"><AlertCircle size={12} /> {errors.university}</div>}
            </div>

            {/* Current Year */}
            <div className="form-group">
              <label className="form-label">
                <span>Current Year of Study <span className="required">*</span></span>
              </label>
              <select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                className={`form-select ${errors.currentYear ? 'has-error' : ''}`}
              >
                <option value="">Select Academic Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate (Masters/PhD)">Postgraduate (Masters/PhD)</option>
              </select>
              {errors.currentYear && <div className="error-text"><AlertCircle size={12} /> {errors.currentYear}</div>}
            </div>

            {/* Branch */}
            <div className="form-group">
              <label className="form-label">
                <span>Branch / Specialization <span className="required">*</span></span>
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
                className={`form-input ${errors.branch ? 'has-error' : ''}`}
              />
              {errors.branch && <div className="error-text"><AlertCircle size={12} /> {errors.branch}</div>}
            </div>

            {/* CGPA */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <span>Current CGPA (0.00 - 10.00) <span className="required">*</span></span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.95"
                className={`form-input ${errors.cgpa ? 'has-error' : ''}`}
              />
              {errors.cgpa && <div className="error-text"><AlertCircle size={12} /> {errors.cgpa}</div>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Financial & Category Details */}
        <div className="form-section">
          <div className="form-section-title">
            <Award size={20} color="var(--accent-amber)" />
            <span>3. Financial & Category Eligibility</span>
          </div>

          <div className="form-grid-3">
            {/* Annual Family Income */}
            <div className="form-group">
              <label className="form-label">
                <span>Annual Family Income (₹) <span className="required">*</span></span>
              </label>
              <input
                type="number"
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                placeholder="e.g. 350000"
                className={`form-input ${errors.familyIncome ? 'has-error' : ''}`}
              />
              {errors.familyIncome && <div className="error-text"><AlertCircle size={12} /> {errors.familyIncome}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <span>Category <span className="required">*</span></span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'has-error' : ''}`}
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div className="error-text"><AlertCircle size={12} /> {errors.category}</div>}
            </div>

            {/* Scholarship Type */}
            <div className="form-group">
              <label className="form-label">
                <span>Scholarship Type <span className="required">*</span></span>
              </label>
              <select
                name="scholarshipType"
                value={formData.scholarshipType}
                onChange={handleChange}
                className={`form-select ${errors.scholarshipType ? 'has-error' : ''}`}
              >
                <option value="">Select Scholarship Program</option>
                <option value="Merit-Based Academic Excellence">Merit-Based Academic Excellence</option>
                <option value="Need-Based Financial Assistance">Need-Based Financial Assistance</option>
                <option value="Women in STEM Leadership">Women in STEM Leadership</option>
                <option value="Underrepresented Minorities in Tech">Underrepresented Minorities in Tech</option>
                <option value="Research & Innovation Grant">Research & Innovation Grant</option>
              </select>
              {errors.scholarshipType && <div className="error-text"><AlertCircle size={12} /> {errors.scholarshipType}</div>}
            </div>
          </div>
        </div>

        {/* SECTION 4: Statement of Purpose & Documents */}
        <div className="form-section">
          <div className="form-section-title">
            <FileText size={20} color="var(--accent-emerald)" />
            <span>4. Statement of Purpose & Document Verification</span>
          </div>

          {/* Statement of Purpose */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label">
                <span>Statement of Purpose (SOP) <span className="required">*</span></span>
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateAiSop}
                disabled={isAiGeneratingSop}
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Sparkles size={13} color="var(--accent-cyan)" />
                <span>{isAiGeneratingSop ? 'Generating Draft...' : 'AI Assist SOP'}</span>
              </button>
            </div>
            <textarea
              name="statementOfPurpose"
              rows={5}
              value={formData.statementOfPurpose}
              onChange={handleChange}
              placeholder="Detail your academic achievements, career goals, financial need, and why you are applying for this scholarship..."
              className={`form-textarea ${errors.statementOfPurpose ? 'has-error' : ''}`}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Min 50 characters required</span>
              <span>Count: {formData.statementOfPurpose.length} characters</span>
            </div>
            {errors.statementOfPurpose && <div className="error-text"><AlertCircle size={12} /> {errors.statementOfPurpose}</div>}
          </div>

          {/* Document Uploads */}
          <div className="form-grid-2">
            {/* Income Certificate Upload */}
            <div className="form-group">
              <label className="form-label">
                <span>Income Certificate (PDF/JPG/PNG) <span className="required">*</span></span>
              </label>
              <label className={`file-dropzone ${errors.incomeCertificate ? 'has-error' : ''}`}>
                <UploadCloud size={28} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Click or drag Income Certificate file here
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max file size: 5 MB</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'incomeCertificate')}
                  style={{ display: 'none' }}
                />
              </label>
              {formData.incomeCertificate && (
                <div className="file-preview">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={16} color="var(--accent-emerald)" />
                    <span style={{ fontWeight: 500 }}>{formData.incomeCertificate.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({(formData.incomeCertificate.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, incomeCertificate: null }))}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {errors.incomeCertificate && <div className="error-text"><AlertCircle size={12} /> {errors.incomeCertificate}</div>}
            </div>

            {/* Marksheet Upload */}
            <div className="form-group">
              <label className="form-label">
                <span>Marksheet / Transcript (PDF/JPG/PNG) <span className="required">*</span></span>
              </label>
              <label className={`file-dropzone ${errors.marksheet ? 'has-error' : ''}`}>
                <UploadCloud size={28} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Click or drag Marksheet file here
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max file size: 5 MB</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'marksheet')}
                  style={{ display: 'none' }}
                />
              </label>
              {formData.marksheet && (
                <div className="file-preview">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={16} color="var(--accent-emerald)" />
                    <span style={{ fontWeight: 500 }}>{formData.marksheet.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({(formData.marksheet.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, marksheet: null }))}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {errors.marksheet && <div className="error-text"><AlertCircle size={12} /> {errors.marksheet}</div>}
            </div>
          </div>
        </div>

        {/* SECTION 5: Declaration & Action Buttons */}
        <div className="form-section" style={{ background: 'rgba(17, 24, 39, 0.95)' }}>
          {/* Declaration Checkbox */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="declared"
                checked={formData.declared}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-indigo)' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                I hereby declare that all the information provided in this application is true, complete, and correct to the best of my knowledge. I understand that any false statement or omission may lead to immediate disqualification or revocation of the scholarship award.
              </span>
            </label>
            {errors.declared && <div className="error-text"><AlertCircle size={12} /> {errors.declared}</div>}
          </div>

          {/* Buttons: Submit & Reset */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <RotateCcw size={16} />
              <span>Reset Form</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '160px' }}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* SUBMISSION RECEIPT MODAL */}
      {receipt && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <CheckCircle2 size={32} color="var(--accent-emerald)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Your scholarship application has been logged into the selection system.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Application Reference ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>{receipt.applicationId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Submitted At:</span>
                <span>{receipt.submittedAt}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span>
                <span style={{ fontWeight: 600 }}>{receipt.data.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scholarship Program:</span>
                <span style={{ color: 'var(--accent-purple)' }}>{receipt.data.scholarshipType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Documents Uploaded:</span>
                <span>
                  {receipt.data.incomeCertificate ? 'Income Cert ✓' : ''} | {receipt.data.marksheet ? 'Marksheet ✓' : ''}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setReceipt(null);
                  handleReset();
                }}
              >
                Done / Start New Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
