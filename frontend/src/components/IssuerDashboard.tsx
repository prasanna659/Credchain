import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, ArrowLeft, Plus, Database, Shield, CheckCircle } from 'lucide-react'

interface IssuerDashboardProps {
  onBack: () => void
}

const IssuerDashboard: React.FC<IssuerDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('register')
  const [formData, setFormData] = useState({
    issuerAddress: '0x1234567890123456789012345678901234567890',
    issuerName: 'IIT Delhi',
    stakeAmount: '1000'
  })

  const tabs = [
    { id: 'register', label: 'Register', icon: Shield },
    { id: 'create-batch', label: 'Create Batch', icon: Plus },
    { id: 'manage-batches', label: 'Manage Batches', icon: Database }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

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
                <Building className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Issuer Dashboard</h1>
                  <p className="text-gray-600">Register and manage credential batches</p>
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
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
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
              {activeTab === 'register' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Register as Credential Issuer</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuer Address (wallet)
                      </label>
                      <input
                        type="text"
                        name="issuerAddress"
                        value={formData.issuerAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuer Name
                      </label>
                      <input
                        type="text"
                        name="issuerName"
                        value={formData.issuerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., IIT Delhi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stake Amount (MATIC)
                      </label>
                      <input
                        type="number"
                        name="stakeAmount"
                        value={formData.stakeAmount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="1000"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Register Issuer
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'create-batch' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Credential Batch</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800">
                      <strong>Note:</strong> Upload a CSV file with student credentials. The system will generate Merkle proofs and anchor them to the blockchain.
                    </p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'manage-batches' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Credential Batches</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((batch) => (
                      <div key={batch} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Batch #{batch}</h3>
                            <p className="text-gray-600">Created on 2024-01-{batch.toString().padStart(2, '0')}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">Anchored</span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Students:</span>
                            <span className="ml-2 font-medium">150</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Merkle Root:</span>
                            <span className="ml-2 font-mono text-xs">0x1234...5678</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tx Hash:</span>
                            <span className="ml-2 font-mono text-xs">0xabcd...efgh</span>
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

export default IssuerDashboard
