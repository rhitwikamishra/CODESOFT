import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import { Job } from '../contexts/DataContext';

const JobListings: React.FC = () => {
  const { jobs, searchJobs } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    
    const results = searchJobs(query, location, type);
    setFilteredJobs(results);
    setCurrentPage(1);
  }, [searchParams, jobs, searchJobs]);

  const handleSearch = (query: string, location: string, type: string) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    
    setSearchParams(params);
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Listings</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Job Results */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </p>
            </div>
            
            {currentJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === index + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } border border-gray-300`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Categories</h3>
              <div className="space-y-2">
                {['Technology', 'Marketing', 'Design', 'Sales', 'Customer Service', 'Finance'].map(category => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <span className="text-gray-500 text-sm">
                      {Math.floor(Math.random() * 20) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;