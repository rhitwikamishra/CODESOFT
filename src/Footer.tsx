import React from 'react';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">JobBoard</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connect talented professionals with amazing opportunities. 
              Your career journey starts here.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">contact@jobboard.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</a></li>
              <li><a href="/register" className="hover:text-blue-400 transition-colors">Create Profile</a></li>
              <li><a href="/candidate-dashboard" className="hover:text-blue-400 transition-colors">Career Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/employer-dashboard" className="hover:text-blue-400 transition-colors">Post Jobs</a></li>
              <li><a href="/register" className="hover:text-blue-400 transition-colors">Employer Account</a></li>
              <li><a href="/employer-dashboard" className="hover:text-blue-400 transition-colors">Find Candidates</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JobBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;