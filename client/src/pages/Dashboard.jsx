import { useEffect, useState } from 'react';
import { fetchJobs, deleteJob } from '../api';
import JobForm from '../components/JobForm';
import "./Dashboard.css";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({});
  const [editingJob, setEditingJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSureModal, setShowSureModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const loadJobs = async () => {
    try {
      const res = await fetchJobs(filter);
      setJobs(res.data);
    } catch (err) {
      alert('Failed to fetch jobs');
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    if (!id) return;
    await deleteJob(id);
    loadJobs();
    setJobToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const openModalForNew = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const openModalForEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  useEffect(() => {
    loadJobs();
  }, [filter]);

  return (
    <div>
      <div className="dashboard-heading">
        <h2>Your Job Applications</h2>
        <button onClick={handleLogout} className='dashboard-logout-btn'>
          Logout
        </button>
      </div>

      <div className='dashboard-filter-ribbon'>
        <div className='dashboard-filter-ribbon-filters'>
          <select onChange={(e) => setFilter({ ...filter, status: e.target.value })} className='dashboard-filter-ribbon-filters-status'>
            <option value="">All Status</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input type="date" onChange={(e) => setFilter({ ...filter, date: e.target.value })}/>
        </div>
        <button onClick={openModalForNew} >
          + Add Job
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='dashboard-modal-overlay'>
          <div className='dashboard-modal'>
            <button
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <JobForm
              onJobAdded={() => {
                loadJobs();
                setShowModal(false);
              }}
              editingJob={editingJob}
              onUpdateJob={() => {
                loadJobs();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}

      {showSureModal && (
        <div className='dashboard-modal-overlay'>
          <div className='dashboard-modal'>
            <h3>Are you Sure?</h3>
            <div style={{display: "flex", gap: "10px", justifyContent: "end"}}>
              <button 
                onClick={() => {
                  handleDelete(jobToDelete);
                  setShowSureModal(false);
                }}
                style={{backgroundColor: "  rgb(250, 38, 38)"}}>Yes</button>
              <button style={{backgroundColor: "  rgb(57, 102, 247)"}} onClick={()=> setShowSureModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
{/* 
      <div className='dashboard-list-container'>
        {jobs.map((job) => (
          <div key={job._id} className='dashboard-list-item'>
            <div>{job.company}</div>
            <div>{job.role}</div>
            <div>Status: {job.status}</div>
            <div>Applied: {new Date(job.dateOfApplication).toLocaleDateString()}</div>
            {job.link && <a href={job.link} target="_blank" rel="noreferrer">Link</a>}
            <div className='dashboard-item-btn-group'>
              <button onClick={() => openModalForEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div> */}

      <div className="dashboard-table">
        <div className="dashboard-table-header">
          <span>Company</span>
          <span>Role</span>
          <span className='span-center'>Status</span>
          <span className='span-center'>Applied</span>
          <span className='span-center'>Link</span>
          <span className='span-center'>Actions</span>
        </div>
        {jobs.map((job) => (
          <div key={job._id} className="dashboard-table-row">
            <span>{job.company}</span>
            <span>{job.role}</span>
            <span className='span-center'>{job.status}</span>
            <span className='span-center'>{new Date(job.dateOfApplication).toLocaleDateString()}</span>
            <span className='span-center'>
              {job.link && (
                <a href={job.link} target="_blank" rel="noreferrer">Link</a>
              )}
            </span>
            <span className="dashboard-item-btn-group">
              <button onClick={() => openModalForEdit(job)}>Edit</button>
              {/* <button onClick={() => handleDelete(job._id)}>Delete</button> */}
              <button onClick={() => {setJobToDelete(job._id); setShowSureModal(true)}}>Delete</button>
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
