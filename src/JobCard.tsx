import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../contexts/DataContext';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Link to={`/jobs/${job.id}`} className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {job.title}
            </Link>
            {job.featured && (
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">{job.company}</p>
          <div className="flex items-center space-x-4 text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{job.postedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
            {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
          </span>
          <div className="flex items-center space-x-1 text-gray-700">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">{job.salary}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="text-gray-500 text-xs">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Link 
          to={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View Details
        </Link>
        <Link 
          to={`/apply/${job.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;