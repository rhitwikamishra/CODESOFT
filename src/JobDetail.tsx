import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Clock, DollarSign, Users, Star, Calendar } from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-800">
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'employer') {
      alert('Employers cannot apply for jobs. Please log in as a candidate.');
      return;
    }
    
    navigate(`/apply/${job.id}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-yellow-100 text-yellow-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'remote': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  {job.featured && (
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-blue-100 mb-4">{job.company}</h2>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-5 w-5" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                </span>
                <button
                  onClick={handleApplyClick}
                  className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Job Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleApplyClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex-1 sm:flex-none"
              >
                Apply for This Job
              </button>
              <Link
                to="/jobs"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;