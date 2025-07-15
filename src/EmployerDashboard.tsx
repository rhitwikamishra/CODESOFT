import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Users, Briefcase, Building, Mail } from 'lucide-react';

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getJobsByEmployer, getApplicationsByJob, deleteJob, updateJob } = useData();
  const navigate = useNavigate();
  
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    type: 'full-time' as const,
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    featured: false,
  });

  React.useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'employer') {
    return null;
  }

  const jobs = getJobsByEmployer(user.id);
  const totalApplications = jobs.reduce((sum, job) => sum + getApplicationsByJob(job.id).length, 0);

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      ...jobForm,
      company: user.company || '',
      employerId: user.id,
      requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
      benefits: jobForm.benefits.split('\n').filter(benefit => benefit.trim()),
    };

    if (editingJob) {
      updateJob(editingJob, jobData);
      setEditingJob(null);
    } else {
      // This would be addJob in a real implementation
      console.log('Adding job:', jobData);
    }

    setShowJobForm(false);
    setJobForm({
      title: '',
      location: '',
      type: 'full-time',
      salary: '',
      description: '',
      requirements: '',
      benefits: '',
      featured: false,
    });
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job.id);
    setJobForm({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
      featured: job.featured,
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Company</p>
                <p className="text-lg font-bold text-gray-900">{user.company}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Job Listings</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Post New Job</span>
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No jobs posted yet.</p>
              <button
                onClick={() => setShowJobForm(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map(job => (
                <div key={job.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600 mt-1">{job.location} • {job.type}</p>
                      <p className="text-gray-600 mt-1">{job.salary}</p>
                      <p className="text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-500">
                          {getApplicationsByJob(job.id).length} applications
                        </span>
                        <span className="text-sm text-gray-500">
                          Posted {job.postedDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Job"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingJob ? 'Edit Job' : 'Post New Job'}
                </h3>
              </div>
              
              <form onSubmit={handleJobSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({...jobForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                    placeholder="e.g., $80,000 - $120,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                    placeholder="React experience&#10;3+ years of experience&#10;Bachelor's degree"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits (one per line)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({...jobForm, benefits: e.target.value})}
                    placeholder="Health Insurance&#10;Dental Insurance&#10;Flexible Schedule"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={jobForm.featured}
                    onChange={(e) => setJobForm({...jobForm, featured: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Job (appears on homepage)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobForm(false);
                      setEditingJob(null);
                      setJobForm({
                        title: '',
                        location: '',
                        type: 'full-time',
                        salary: '',
                        description: '',
                        requirements: '',
                        benefits: '',
                        featured: false,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;