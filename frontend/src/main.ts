import './style.css'
import { renderIssuerDashboard } from './issuer'
import { renderStudentDashboard } from './student'
import { renderEmployerDashboard } from './employer'
import { getWorkflow } from './api'

async function bootstrap() {
    const app = document.querySelector<HTMLDivElement>('#app')
    if (!app) return

    // Role selection screen
    app.innerHTML = `
        <div class="role-selector">
            <header class="page-header">
                <div class="page-title-group">
                    <h1 class="page-title">🚀 NexusCred</h1>
                    <p class="page-subtitle">
                        Zero-Knowledge Credential Verification System
                    </p>
                </div>
            </header>

            <main class="page-main role-selection">
                <p class="intro-text">Select your role to view the dashboard:</p>
                
                <div class="role-cards">
                    <button class="role-card issuer-card" onclick="selectRole('issuer')">
                        <h2>🏛️ ISSUER</h2>
                        <p>Register as a credential issuer (IIT, AWS, Infosys)</p>
                        <ul>
                            <li>Stake MATIC tokens</li>
                            <li>Create credential batches</li>
                            <li>Calculate Merkle roots</li>
                            <li>Anchor to blockchain</li>
                        </ul>
                    </button>

                    <button class="role-card student-card" onclick="selectRole('student')">
                        <h2>🎓 STUDENT</h2>
                        <p>Hold credentials and prove eligibility</p>
                        <ul>
                            <li>View your VCs</li>
                            <li>Find eligible jobs</li>
                            <li>Generate ZK proofs (local)</li>
                            <li>Receive SBTs</li>
                        </ul>
                    </button>

                    <button class="role-card employer-card" onclick="selectRole('employer')">
                        <h2>🏢 EMPLOYER</h2>
                        <p>Post blind job requirements and hire</p>
                        <ul>
                            <li>Post job requirements</li>
                            <li>Blind commitment (hash only)</li>
                            <li>View anonymous results</li>
                            <li>Verify eligibility</li>
                        </ul>
                    </button>
                </div>

                <section class="workflow-demo">
                    <h3>Complete Workflow (9 Steps)</h3>
                    <div id="workflow-summary"></div>
                </section>
            </main>
        </div>
    `

    // Load and display workflow
    try {
        const workflow = await getWorkflow()
        const summary = document.getElementById('workflow-summary')
        if (summary) {
            let html = '<ol class="workflow-steps">'
            workflow.steps.forEach((step: any) => {
                html += `
                    <li class="workflow-step">
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                    </li>
                `
            })
            html += '</ol>'
            summary.innerHTML = html
        }
    } catch (error) {
        console.error('Failed to load workflow:', error)
    }

    // Make selectRole available globally
    (window as any).selectRole = (role: string) => {
        console.log(`Selected role: ${role}`)
        if (role === 'issuer') {
            renderIssuerDashboard()
        } else if (role === 'student') {
            renderStudentDashboard()
        } else if (role === 'employer') {
            renderEmployerDashboard()
        }
    }
}

void bootstrap()

