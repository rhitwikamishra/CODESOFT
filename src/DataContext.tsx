import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  employerId: string;
  postedDate: string;
  featured: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  resume: string;
  coverLetter: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
}

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  getJobsByEmployer: (employerId: string) => Job[];
  getApplicationsByCandidate: (candidateId: string) => Application[];
  getApplicationsByJob: (jobId: string) => Application[];
  searchJobs: (query: string, location?: string, type?: string) => Job[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Sample data
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$120,000 - $150,000',
    description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.',
    requirements: ['React', 'TypeScript', 'CSS', '5+ years experience'],
    benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan', 'Flexible Schedule'],
    employerId: '1',
    postedDate: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'remote',
    salary: '$90,000 - $120,000',
    description: 'Join our fast-growing startup as a Full Stack Developer and help shape the future of our platform.',
    requirements: ['Node.js', 'React', 'MongoDB', '3+ years experience'],
    benefits: ['Stock Options', 'Health Insurance', 'Remote Work', 'Professional Development'],
    employerId: '2',
    postedDate: '2024-01-14',
    featured: true,
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$80,000 - $100,000',
    description: 'Create beautiful and intuitive user interfaces and experiences for our clients.',
    requirements: ['Figma', 'Adobe Creative Suite', 'User Research', '4+ years experience'],
    benefits: ['Creative Environment', 'Health Insurance', 'Flexible Hours', 'Conference Budget'],
    employerId: '3',
    postedDate: '2024-01-13',
    featured: false,
  },
];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    const storedApplications = localStorage.getItem('applications');
    
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      setJobs(sampleJobs);
      localStorage.setItem('jobs', JSON.stringify(sampleJobs));
    }
    
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const addApplication = (applicationData: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter(job => job.employerId === employerId);
  };

  const getApplicationsByCandidate = (candidateId: string) => {
    return applications.filter(app => app.candidateId === candidateId);
  };

  const getApplicationsByJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const searchJobs = (query: string, location?: string, type?: string) => {
    return jobs.filter(job => {
      const matchesQuery = query === '' || 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesLocation = !location || location === '' || 
        job.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesType = !type || type === '' || job.type === type;
      
      return matchesQuery && matchesLocation && matchesType;
    });
  };

  return (
    <DataContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      addApplication,
      updateApplicationStatus,
      getJobsByEmployer,
      getApplicationsByCandidate,
      getApplicationsByJob,
      searchJobs,
    }}>
      {children}
    </DataContext.Provider>
  );
};