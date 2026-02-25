import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Shield, Zap, Lock } from 'lucide-react'
import RoleSelection from './components/RoleSelection'
import IssuerDashboard from './components/IssuerDashboard'
import StudentDashboard from './components/StudentDashboard'
import EmployerDashboard from './components/EmployerDashboard'

type Role = 'issuer' | 'student' | 'employer' | null

function App() {
  const [selectedRole, setSelectedRole] = useState<Role>(null)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handleBackToHome = () => {
    setSelectedRole(null)
  }

  if (selectedRole === 'issuer') {
    return <IssuerDashboard onBack={handleBackToHome} />
  }

  if (selectedRole === 'student') {
    return <StudentDashboard onBack={handleBackToHome} />
  }

  if (selectedRole === 'employer') {
    return <EmployerDashboard onBack={handleBackToHome} />
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Rocket className="w-10 h-10 text-white mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Credchain
              </h1>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto"
            >
              Zero-Knowledge Credential Verification System
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4">
            Select your role to get started
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Choose how you want to participate in the decentralized credential ecosystem
          </p>
        </motion.div>

        {/* Role Cards */}
        <RoleSelection onRoleSelect={handleRoleSelect} />

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Credchain?</h3>
            <p className="text-white/80 text-lg">Revolutionary features for credential verification</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-morphism rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Privacy-First</h4>
              <p className="text-white/80">
                Zero-knowledge proofs ensure your credentials remain private while proving eligibility
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-morphism rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Lightning Fast</h4>
              <p className="text-white/80">
                Instant verification with blockchain-anchored credentials and smart contracts
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-morphism rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Tamper-Proof</h4>
              <p className="text-white/80">
                Cryptographic security ensures credentials cannot be forged or manipulated
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  )
}

export default App
