import React, { useState, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scholarshipSchema, ScholarshipFormValues } from '../schema/scholarshipSchema';
import {
  User,
  BookOpen,
  Award,
  FileText,
  UploadCloud,
  FileCheck,
  RotateCcw,
  Send,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';

export const ScholarshipForm: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<ScholarshipFormValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      collegeName: '',
      university: '',
      branch: '',
      currentYear: '',
      cgpa: '',
      scholarshipType: '',
      category: '',
      familyIncome: '',
      statementOfPurpose: '',
      declaration: false
    }
  });

  const sopValue = watch('statementOfPurpose') || '';

  // Calculate live word count
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(sopValue);

  // Prevent typing beyond 250 words
  const handleSopChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const currentWords = countWords(text);
    if (currentWords > 250) {
      // Truncate to first 250 words if exceeded
      const words = text.trim().split(/\s+/).slice(0, 250);
      setValue('statementOfPurpose', words.join(' '), { shouldValidate: true });
    } else {
      setValue('statementOfPurpose', text, { shouldValidate: true });
    }
  };

  const onSubmit = (data: ScholarshipFormValues) => {
    setSubmittedData(data);
  };

  const handleResetForm = () => {
    reset();
    setSubmittedData(null);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.7))',
        borderLeft: '4px solid var(--accent-cyan)'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          Scholarship <span className="gradient-text">Application Form</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
          Complete all mandatory sections below to submit your official application.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* SECTION 1: Personal Information */}
        <section className="form-section" aria-labelledby="section-personal">
          <h2 id="section-personal" className="form-section-title">
            <User size={20} color="var(--accent-cyan)" />
            <span>1. Personal Information</span>
          </h2>

          <div className="form-grid-2">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <span>Full Name <span className="required">*</span></span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Adarsh Sharma"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                {...register('fullName')}
              />
              {errors.fullName && (
                <span id="fullName-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span>Email Address <span className="required">*</span></span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <span id="email-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <span>Phone Number <span className="required">*</span></span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                {...register('phone')}
              />
              {errors.phone && (
                <span id="phone-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.phone.message}
                </span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                <span>Date of Birth <span className="required">*</span></span>
              </label>
              <input
                id="dob"
                type="date"
                aria-invalid={errors.dob ? 'true' : 'false'}
                aria-describedby={errors.dob ? 'dob-error' : undefined}
                className={`form-input ${errors.dob ? 'has-error' : ''}`}
                {...register('dob')}
              />
              {errors.dob && (
                <span id="dob-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.dob.message}
                </span>
              )}
            </div>

            {/* Gender */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="gender" className="form-label">
                <span>Gender <span className="required">*</span></span>
              </label>
              <select
                id="gender"
                aria-invalid={errors.gender ? 'true' : 'false'}
                aria-describedby={errors.gender ? 'gender-error' : undefined}
                className={`form-select ${errors.gender ? 'has-error' : ''}`}
                {...register('gender')}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <span id="gender-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.gender.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: Academic Information */}
        <section className="form-section" aria-labelledby="section-academic">
          <h2 id="section-academic" className="form-section-title">
            <BookOpen size={20} color="var(--accent-purple)" />
            <span>2. Academic Information</span>
          </h2>

          <div className="form-grid-2">
            {/* College Name */}
            <div className="form-group">
              <label htmlFor="collegeName" className="form-label">
                <span>College Name <span className="required">*</span></span>
              </label>
              <input
                id="collegeName"
                type="text"
                placeholder="e.g. National Institute of Technology"
                aria-invalid={errors.collegeName ? 'true' : 'false'}
                aria-describedby={errors.collegeName ? 'collegeName-error' : undefined}
                className={`form-input ${errors.collegeName ? 'has-error' : ''}`}
                {...register('collegeName')}
              />
              {errors.collegeName && (
                <span id="collegeName-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.collegeName.message}
                </span>
              )}
            </div>

            {/* University */}
            <div className="form-group">
              <label htmlFor="university" className="form-label">
                <span>University <span className="required">*</span></span>
              </label>
              <input
                id="university"
                type="text"
                placeholder="e.g. State Technological University"
                aria-invalid={errors.university ? 'true' : 'false'}
                aria-describedby={errors.university ? 'university-error' : undefined}
                className={`form-input ${errors.university ? 'has-error' : ''}`}
                {...register('university')}
              />
              {errors.university && (
                <span id="university-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.university.message}
                </span>
              )}
            </div>

            {/* Branch */}
            <div className="form-group">
              <label htmlFor="branch" className="form-label">
                <span>Branch / Course <span className="required">*</span></span>
              </label>
              <input
                id="branch"
                type="text"
                placeholder="e.g. Computer Science & Engineering"
                aria-invalid={errors.branch ? 'true' : 'false'}
                aria-describedby={errors.branch ? 'branch-error' : undefined}
                className={`form-input ${errors.branch ? 'has-error' : ''}`}
                {...register('branch')}
              />
              {errors.branch && (
                <span id="branch-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.branch.message}
                </span>
              )}
            </div>

            {/* Current Year */}
            <div className="form-group">
              <label htmlFor="currentYear" className="form-label">
                <span>Current Year of Study <span className="required">*</span></span>
              </label>
              <select
                id="currentYear"
                aria-invalid={errors.currentYear ? 'true' : 'false'}
                aria-describedby={errors.currentYear ? 'currentYear-error' : undefined}
                className={`form-select ${errors.currentYear ? 'has-error' : ''}`}
                {...register('currentYear')}
              >
                <option value="">Select Academic Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
              {errors.currentYear && (
                <span id="currentYear-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.currentYear.message}
                </span>
              )}
            </div>

            {/* CGPA */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="cgpa" className="form-label">
                <span>CGPA (0 to 10) <span className="required">*</span></span>
              </label>
              <input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="e.g. 8.75"
                aria-invalid={errors.cgpa ? 'true' : 'false'}
                aria-describedby={errors.cgpa ? 'cgpa-error' : undefined}
                className={`form-input ${errors.cgpa ? 'has-error' : ''}`}
                {...register('cgpa')}
              />
              {errors.cgpa && (
                <span id="cgpa-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.cgpa.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: Scholarship Information */}
        <section className="form-section" aria-labelledby="section-scholarship">
          <h2 id="section-scholarship" className="form-section-title">
            <Award size={20} color="var(--accent-amber)" />
            <span>3. Scholarship Information</span>
          </h2>

          <div className="form-grid-3">
            {/* Scholarship Type */}
            <div className="form-group">
              <label htmlFor="scholarshipType" className="form-label">
                <span>Scholarship Type <span className="required">*</span></span>
              </label>
              <select
                id="scholarshipType"
                aria-invalid={errors.scholarshipType ? 'true' : 'false'}
                aria-describedby={errors.scholarshipType ? 'scholarshipType-error' : undefined}
                className={`form-select ${errors.scholarshipType ? 'has-error' : ''}`}
                {...register('scholarshipType')}
              >
                <option value="">Select Type</option>
                <option value="Merit-Based">Merit-Based</option>
                <option value="Need-Based">Need-Based</option>
                <option value="Women in Tech">Women in Tech</option>
                <option value="STEM Excellence">STEM Excellence</option>
                <option value="Sports & Leadership">Sports & Leadership</option>
              </select>
              {errors.scholarshipType && (
                <span id="scholarshipType-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.scholarshipType.message}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <span>Category <span className="required">*</span></span>
              </label>
              <select
                id="category"
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'category-error' : undefined}
                className={`form-select ${errors.category ? 'has-error' : ''}`}
                {...register('category')}
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <span id="category-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.category.message}
                </span>
              )}
            </div>

            {/* Annual Family Income */}
            <div className="form-group">
              <label htmlFor="familyIncome" className="form-label">
                <span>Annual Family Income (₹) <span className="required">*</span></span>
              </label>
              <input
                id="familyIncome"
                type="number"
                min="1"
                placeholder="e.g. 250000"
                aria-invalid={errors.familyIncome ? 'true' : 'false'}
                aria-describedby={errors.familyIncome ? 'familyIncome-error' : undefined}
                className={`form-input ${errors.familyIncome ? 'has-error' : ''}`}
                {...register('familyIncome')}
              />
              {errors.familyIncome && (
                <span id="familyIncome-error" className="error-text" role="alert">
                  <AlertCircle size={13} /> {errors.familyIncome.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: Statement of Purpose */}
        <section className="form-section" aria-labelledby="section-sop">
          <h2 id="section-sop" className="form-section-title">
            <FileText size={20} color="var(--accent-emerald)" />
            <span>4. Statement of Purpose</span>
          </h2>

          <div className="form-group">
            <label htmlFor="statementOfPurpose" className="form-label">
              <span>Statement of Purpose <span className="required">*</span></span>
            </label>
            <textarea
              id="statementOfPurpose"
              rows={5}
              placeholder="Write your statement of purpose detailing your academic goals, financial need, and career aspirations..."
              aria-invalid={errors.statementOfPurpose ? 'true' : 'false'}
              aria-describedby={errors.statementOfPurpose ? 'statementOfPurpose-error' : 'sop-counter'}
              className={`form-textarea ${errors.statementOfPurpose ? 'has-error' : ''}`}
              value={sopValue}
              onChange={handleSopChange}
            />

            <div id="sop-counter" style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: wordCount >= 250 ? 'var(--accent-rose)' : 'var(--text-muted)',
              marginTop: '4px'
            }}>
              <span>Maximum 250 words allowed</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {wordCount} / 250 words
              </span>
            </div>

            {errors.statementOfPurpose && (
              <span id="statementOfPurpose-error" className="error-text" role="alert">
                <AlertCircle size={13} /> {errors.statementOfPurpose.message}
              </span>
            )}
          </div>
        </section>

        {/* SECTION 5: Document Upload */}
        <section className="form-section" aria-labelledby="section-documents">
          <h2 id="section-documents" className="form-section-title">
            <UploadCloud size={20} color="var(--accent-cyan)" />
            <span>5. Document Upload</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Allowed formats: PDF, JPG, JPEG, PNG. Maximum file size: 5 MB per document.
          </p>

          <div className="form-grid-2">
            {/* Income Certificate Upload */}
            <Controller
              name="incomeCertificate"
              control={control}
              render={({ field }) => (
                <div className="form-group">
                  <label htmlFor="incomeCertificate" className="form-label">
                    <span>Income Certificate <span className="required">*</span></span>
                  </label>
                  {!field.value ? (
                    <label className={`file-dropzone ${errors.incomeCertificate ? 'has-error' : ''}`}>
                      <UploadCloud size={28} color="var(--accent-cyan)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Click to select Income Certificate
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        PDF, JPG, JPEG, PNG (Max 5MB)
                      </span>
                      <input
                        id="incomeCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        aria-invalid={errors.incomeCertificate ? 'true' : 'false'}
                        aria-describedby={errors.incomeCertificate ? 'incomeCertificate-error' : undefined}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ) : (
                    <div className="file-preview">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCheck size={16} color="var(--accent-emerald)" />
                        <span style={{ fontWeight: 500 }}>{field.value.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({(field.value.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        aria-label="Remove Income Certificate"
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.incomeCertificate && (
                    <span id="incomeCertificate-error" className="error-text" role="alert">
                      <AlertCircle size={13} /> {errors.incomeCertificate.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Latest Marksheet Upload */}
            <Controller
              name="marksheet"
              control={control}
              render={({ field }) => (
                <div className="form-group">
                  <label htmlFor="marksheet" className="form-label">
                    <span>Latest Marksheet <span className="required">*</span></span>
                  </label>
                  {!field.value ? (
                    <label className={`file-dropzone ${errors.marksheet ? 'has-error' : ''}`}>
                      <UploadCloud size={28} color="var(--accent-purple)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Click to select Latest Marksheet
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        PDF, JPG, JPEG, PNG (Max 5MB)
                      </span>
                      <input
                        id="marksheet"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        aria-invalid={errors.marksheet ? 'true' : 'false'}
                        aria-describedby={errors.marksheet ? 'marksheet-error' : undefined}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ) : (
                    <div className="file-preview">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCheck size={16} color="var(--accent-emerald)" />
                        <span style={{ fontWeight: 500 }}>{field.value.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({(field.value.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        aria-label="Remove Marksheet"
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.marksheet && (
                    <span id="marksheet-error" className="error-text" role="alert">
                      <AlertCircle size={13} /> {errors.marksheet.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </section>

        {/* SECTION 6: Declaration */}
        <section className="form-section" style={{ background: 'rgba(17, 24, 39, 0.95)' }} aria-labelledby="section-declaration">
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                id="declaration"
                type="checkbox"
                aria-invalid={errors.declaration ? 'true' : 'false'}
                aria-describedby={errors.declaration ? 'declaration-error' : undefined}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-indigo)' }}
                {...register('declaration')}
              />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                I hereby declare that the information provided above is true to the best of my knowledge. <span className="required">*</span>
              </span>
            </label>
            {errors.declaration && (
              <span id="declaration-error" className="error-text" role="alert">
                <AlertCircle size={13} /> {errors.declaration.message}
              </span>
            )}
          </div>

          {/* SECTION 7: Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetForm}
              disabled={isSubmitting}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '150px' }}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </section>
      </form>

      {/* Submission Success Dialog */}
      {submittedData && (
        <div className="modal-backdrop" role="dialog" aria-labelledby="dialog-title" aria-modal="true">
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
              <h2 id="dialog-title" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Your scholarship application has been validated and received.
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
                <span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span>
                <span style={{ fontWeight: 600 }}>{submittedData.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <span>{submittedData.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scholarship Type:</span>
                <span style={{ color: 'var(--accent-purple)' }}>{submittedData.scholarshipType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Documents Uploaded:</span>
                <span>
                  {submittedData.incomeCertificate.name} & {submittedData.marksheet.name}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={handleResetForm}
              >
                Close & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
