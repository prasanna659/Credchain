import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, ArrowLeft, Plus, List, Users, CheckCircle } from 'lucide-react'

interface EmployerDashboardProps {
  onBack: () => void
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('post-requirement')
  const [formData, setFormData] = useState({
    employerAddress: '0x9999999999999999999999999999999999999999999999',
    jobDescription: 'We need a senior engineer with strong academics (GPA 7.5+), cloud experience (AWS/GCP certified), and at least 2 years of engineering work.'
  })

  const tabs = [
    { id: 'post-requirement', label: 'Post Job', icon: Plus },
    { id: 'view-requirements', label: 'My Requirements', icon: List },
    { id: 'candidates', label: 'Candidate Results', icon: Users }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const mockRequirements = [
    {
      id: 1,
      position: 'Senior Software Engineer',
      date: '2024-01-15',
      status: 'Active',
      applicants: 12,
      hash: '0x1234...5678'
    },
    {
      id: 2,
      position: 'Cloud Architect',
      date: '2024-01-10',
      status: 'Active',
      applicants: 8,
      hash: '0xabcd...efgh'
    }
  ]

  const mockCandidates = [
    {
      id: 1,
      position: 'Senior Software Engineer',
      anonymousId: 'Candidate #001',
      matchScore: '95%',
      proofVerified: true,
      appliedDate: '2024-01-16'
    },
    {
      id: 2,
      position: 'Senior Software Engineer',
      anonymousId: 'Candidate #002',
      matchScore: '88%',
      proofVerified: true,
      appliedDate: '2024-01-17'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
                  <p className="text-gray-600">Post jobs and find qualified candidates</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              {activeTab === 'post-requirement' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Blind Job Requirement</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">
                      <strong>Privacy First:</strong> You describe the job in plain English. Our AI converts it to structured predicates. Only the hash is posted on-chain. The actual requirements stay private.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employer Address</label>
                      <input
                        type="text"
                        name="employerAddress"
                        value={formData.employerAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Description (Plain English)</label>
                      <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="e.g., We need a senior engineer with strong academics, cloud experience, and 2+ years of work."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Post Job Requirement
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'view-requirements' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Job Requirements</h2>
                  <div className="space-y-4">
                    {mockRequirements.map((req) => (
                      <div key={req.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{req.position}</h3>
                            <p className="text-gray-600">Posted: {req.date}</p>
                            <p className="text-sm text-gray-500">Hash: {req.hash}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 font-medium">{req.status}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {req.applicants} Applicants
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'candidates' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidate Results</h2>
                  <p className="text-gray-600 mb-6">
                    Anonymous candidates who have verified they meet your job requirements using zero-knowledge proofs:
                  </p>

                  <div className="space-y-4">
                    {mockCandidates.map((candidate) => (
                      <div key={candidate.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{candidate.anonymousId}</h3>
                            <p className="text-gray-600">{candidate.position}</p>
                            <p className="text-sm text-gray-500">Applied: {candidate.appliedDate}</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {candidate.matchScore} Match
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">ZK Proof Verified</span>
                            </div>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm mt-2">
                              View Profile (Anonymized)
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard
