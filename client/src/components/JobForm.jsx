import { useState, useEffect } from 'react';
import { createJob, updateJob } from '../api';
import "./JobForm.css";

export default function JobForm({ onJobAdded, editingJob, onUpdateJob }) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    dateOfApplication: '',
    link: ''
  });

  useEffect(() => {
    if (editingJob) {
      setForm({
        company: editingJob.company,
        role: editingJob.role,
        status: editingJob.status,
        dateOfApplication: editingJob.dateOfApplication?.slice(0, 10), 
        link: editingJob.link || ''
      });
    }
  }, [editingJob]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateJob(editingJob._id, form);
        onUpdateJob();
      } else {
        await createJob(form);
        onJobAdded();
      }
      setForm({
        company: '',
        role: '',
        status: 'Applied',
        dateOfApplication: '',
        link: ''
      });
    } catch (err) {
      alert('Failed to save job');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className='job-form'>
      <h3>{editingJob ? 'Edit Job' : 'Add Job Application'}</h3>
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required className='job-form-input' />
      <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required className='job-form-input' />
      <select name="status" value={form.status} onChange={handleChange} className='job-form-input' >
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input type="date" name="dateOfApplication" value={form.dateOfApplication} onChange={handleChange} required className='job-form-input' />
      <input name="link" placeholder="Job Link (optional)" value={form.link} onChange={handleChange} className='job-form-input' />
      <button type="submit">
        {editingJob ? 'Update' : 'Add'}
      </button>
    </form>
  );
}
