import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, ArrowLeft, Award, FileText, Briefcase, Shield } from 'lucide-react'

interface StudentDashboardProps {
  onBack: () => void
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('credentials')
  const [studentId, setStudentId] = useState('S001')

  const tabs = [
    { id: 'credentials', label: 'My Credentials', icon: FileText },
    { id: 'eligible-jobs', label: 'Eligible Jobs', icon: Briefcase },
    { id: 'generate-proof', label: 'Generate Proof', icon: Shield },
    { id: 'my-sbts', label: 'My SBTs', icon: Award }
  ]

  const mockCredentials = [
    {
      id: 1,
      issuer: 'IIT Delhi',
      type: 'Bachelor of Technology',
      date: '2023-06-15',
      status: 'Verified',
      gpa: '8.5/10'
    },
    {
      id: 2,
      issuer: 'AWS',
      type: 'Cloud Practitioner Certification',
      date: '2023-09-20',
      status: 'Verified',
      score: '850/1000'
    }
  ]

  const mockJobs = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Senior Software Engineer',
      requirements: 'B.Tech + AWS Certified + 2+ years experience',
      matchScore: '95%'
    },
    {
      id: 2,
      company: 'DataSoft',
      position: 'Cloud Architect',
      requirements: 'B.Tech + Cloud certifications + 3+ years experience',
      matchScore: '88%'
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
                <GraduationCap className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Student Wallet</h1>
                  <p className="text-gray-600">Manage your credentials and find opportunities</p>
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
                        ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
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
              {activeTab === 'credentials' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Verifiable Credentials (VCs)</h2>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., S001"
                        />
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors self-end">
                        Fetch Credentials
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {mockCredentials.map((credential) => (
                      <div key={credential.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{credential.type}</h3>
                            <p className="text-gray-600">{credential.issuer}</p>
                            <p className="text-sm text-gray-500">Issued: {credential.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 font-medium">{credential.status}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {credential.gpa || credential.score}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'eligible-jobs' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligible Job Opportunities</h2>
                  <p className="text-gray-600 mb-6">
                    Based on your credentials, these employers have posted blind job requirements you may qualify for:
                  </p>

                  <div className="grid gap-4">
                    {mockJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{job.position}</h3>
                            <p className="text-gray-600">{job.company}</p>
                            <p className="text-sm text-gray-500 mt-2">{job.requirements}</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {job.matchScore} Match
                            </div>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                              Apply Anonymously
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'generate-proof' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Zero-Knowledge Proof</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800">
                      <strong>Privacy Note:</strong> Generate ZK proofs locally to prove you meet job requirements without revealing your actual credentials.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Job Requirement</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option>TechCorp - Senior Software Engineer</option>
                        <option>DataSoft - Cloud Architect</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Credentials to Use</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span>IIT Delhi - Bachelor of Technology</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span>AWS - Cloud Practitioner Certification</span>
                        </label>
                      </div>
                    </div>

                    <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      Generate ZK Proof
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'my-sbts' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Soul-Bound Tokens (SBTs)</h2>
                  <p className="text-gray-600 mb-6">
                    SBTs are non-transferable tokens that represent your verified achievements and are permanently bound to your identity.
                  </p>

                  <div className="grid gap-4">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">🏆 Top Performer</h3>
                          <p className="text-gray-600">Awarded for academic excellence</p>
                          <p className="text-sm text-gray-500">Received: 2023-06-15</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          SBT #001
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">☁️ Cloud Expert</h3>
                          <p className="text-gray-600">Multiple cloud certifications</p>
                          <p className="text-sm text-gray-500">Received: 2023-09-20</p>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          SBT #002
                        </div>
                      </div>
                    </div>
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

export default StudentDashboard
