import React from 'react'
import { motion } from 'framer-motion'
import { Building, GraduationCap, Briefcase, ArrowRight } from 'lucide-react'

interface RoleSelectionProps {
  onRoleSelect: (role: 'issuer' | 'student' | 'employer') => void
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const roles = [
    {
      id: 'issuer',
      icon: Building,
      title: 'ISSUER',
      description: 'Register as a credential issuer',
      subtitle: 'IIT, AWS, Infosys, etc.',
      features: [
        'Stake MATIC tokens',
        'Create credential batches',
        'Calculate Merkle roots',
        'Anchor to blockchain'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'student',
      icon: GraduationCap,
      title: 'STUDENT',
      description: 'Hold credentials and prove eligibility',
      subtitle: 'Verify your qualifications',
      features: [
        'View your VCs',
        'Find eligible jobs',
        'Generate ZK proofs (local)',
        'Receive SBTs'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'employer',
      icon: Briefcase,
      title: 'EMPLOYER',
      description: 'Post blind job requirements and hire',
      subtitle: 'Find qualified candidates',
      features: [
        'Post job requirements',
        'Blind commitment (hash only)',
        'View anonymous results',
        'Verify eligibility'
      ],
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {roles.map((role, index) => {
        const Icon = role.icon
        return (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="group"
          >
            <motion.button
              onClick={() => onRoleSelect(role.id as 'issuer' | 'student' | 'employer')}
              className="w-full text-left bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:border-white/40"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon and Title */}
              <div className="flex items-center mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center mr-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                  <p className="text-white/70 text-sm">{role.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/90 font-medium mb-6">{role.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {role.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-white/80">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Arrow */}
              <div className="flex items-center text-white font-medium">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </motion.button>
          </motion.div>
        )
      })}
    </div>
  )
}

export default RoleSelection
