import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, MapPin, Briefcase, FileText, Edit, Save, X } from 'lucide-react';

const CandidateDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { getApplicationsByCandidate, jobs } = useData();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
    education: user?.education || '',
  });

  React.useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'candidate') {
    return null;
  }

  const applications = getApplicationsByCandidate(user.id);
  const appliedJobs = jobs.filter(job => applications.some(app => app.jobId === job.id));

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      title: profileForm.title,
      bio: profileForm.bio,
      skills: profileForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      experience: profileForm.experience,
      education: profileForm.education,
    });
    setIsEditing(false);
  };

  const getApplicationStatus = (jobId: string) => {
    const application = applications.find(app => app.jobId === jobId);
    return application?.status || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your profile and track your applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({...profileForm, title: e.target.value})}
                        placeholder="e.g., Senior Software Developer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={profileForm.skills}
                        onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                        placeholder="React, TypeScript, Node.js, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({...profileForm, experience: e.target.value})}
                        placeholder="Describe your work experience..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education
                      </label>
                      <textarea
                        rows={2}
                        value={profileForm.education}
                        onChange={(e) => setProfileForm({...profileForm, education: e.target.value})}
                        placeholder="Your educational background..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Profile</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 font-medium">{user.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    
                    {user.title && (
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">{user.title}</span>
                      </div>
                    )}
                    
                    {user.bio && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2">About</h3>
                        <p className="text-gray-600">{user.bio}</p>
                      </div>
                    )}
                    
                    {user.skills && user.skills.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {user.experience && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
                        <p className="text-gray-600">{user.experience}</p>
                      </div>
                    )}
                    
                    {user.education && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2">Education</h3>
                        <p className="text-gray-600">{user.education}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Complete</span>
                  <span className="font-medium text-green-600">
                    {user.bio && user.skills?.length ? '90%' : '60%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
                <button
                  onClick={() => setIsEditing(true)}
                  className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications yet.</p>
                <Link
                  to="/jobs"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {appliedJobs.map(job => (
                  <div key={job.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/jobs/${job.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                        <p className="text-gray-600">{job.location} • {job.type}</p>
                        <p className="text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getApplicationStatus(job.id))}`}>
                          {getApplicationStatus(job.id).charAt(0).toUpperCase() + getApplicationStatus(job.id).slice(1)}
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                          Applied {applications.find(app => app.jobId === job.id)?.appliedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;