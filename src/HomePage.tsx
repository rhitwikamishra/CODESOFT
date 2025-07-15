import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, TrendingUp, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { jobs } = useData();
  const navigate = useNavigate();
  
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 3);

  const handleSearch = (query: string, location: string, type: string) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('q', query);
    if (location) searchParams.append('location', location);
    if (type) searchParams.append('type', type);
    
    navigate(`/jobs?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with top employers and discover opportunities that match your skills
            </p>
            <div className="max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{jobs.length}+</h3>
              <p className="text-gray-600">Active Job Listings</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Registered Companies</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover hand-picked opportunities from top companies looking for talented professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/jobs" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who have found their perfect job through JobBoard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?role=candidate" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Find Jobs
            </Link>
            <Link 
              to="/register?role=employer" 
              className="bg-white text-gray-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Post Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;