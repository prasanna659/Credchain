/**
 * Employer Dashboard
 * UI for employers to:
 * - Post blind job requirements
 * - View anonymized candidate results  
 * - Verify ZK proofs
 */

import { postRequirement, getEmployerRequirements } from './api';

export async function renderEmployerDashboard() {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
        <div class="dashboard">
            <aside class="sidebar">
                <div class="logo">🏢 EMPLOYER Dashboard</div>
                <nav class="nav-menu">
                    <button class="nav-item active" data-tab="post-requirement">Post Job</button>
                    <button class="nav-item" data-tab="view-requirements">My Requirements</button>
                    <button class="nav-item" data-tab="candidates">Candidate Results</button>
                </nav>
            </aside>

            <main class="dashboard-main">
                <!-- Post Requirement Tab -->
                <section id="post-requirement-tab" class="tab-content active">
                    <h2>Post a Blind Job Requirement</h2>
                    <div class="card">
                        <p><strong>Privacy First:</strong> You describe the job in plain English. Our AI converts it to structured predicates. Only the hash is posted on-chain. The actual requirements stay private.</p>
                    </div>
                    <form id="req-form" class="card">
                        <div class="form-group">
                            <label>Employer Address</label>
                            <input 
                                type="text" 
                                id="employer-address" 
                                placeholder="0x..." 
                                value="0x9999999999999999999999999999999999999999"
                            />
                        </div>
                        <div class="form-group">
                            <label>Job Description (Plain English)</label>
                            <textarea 
                                id="job-description" 
                                rows="4" 
                                placeholder="e.g., We need a senior engineer with strong academics, cloud experience, and 2+ years of work.">We need a senior engineer with strong academics (GPA 7.5+), cloud experience (AWS/GCP certified), and at least 2 years of engineering work.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Minimum GPA Required</label>
                            <input type="number" id="gpa-min" min="0" max="10" step="0.1" value="7.5" />
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="cloud-certified" checked /> Requires Cloud Certification
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Minimum Years of Experience</label>
                            <input type="number" id="years-min" min="0" value="2" />
                        </div>
                        <div class="form-group">
                            <label>Minimum Graduation Year</label>
                            <input type="number" id="grad-year-min" min="2000" value="2020" />
                        </div>
                        <button type="submit" class="btn btn-primary">Post Requirement (Commit Hash On-Chain)</button>
                    </form>
                    <div id="req-result" class="result-box"></div>
                </section>

                <!-- View Requirements Tab -->
                <section id="view-requirements-tab" class="tab-content">
                    <h2>My Posted Requirements</h2>
                    <form id="view-reqs-form" class="card">
                        <div class="form-group">
                            <label>Employer Address</label>
                            <input 
                                type="text" 
                                id="employer-address-view" 
                                placeholder="0x..." 
                                value="0x9999999999999999999999999999999999999999"
                            />
                        </div>
                        <button type="submit" class="btn btn-secondary">Load My Requirements</button>
                    </form>
                    <div id="requirements-list" class="card"></div>
                </section>

                <!-- Candidates Tab -->
                <section id="candidates-tab" class="tab-content">
                    <h2>Candidate Results</h2>
                    <div class="card">
                        <p><strong>Privacy Guaranteed:</strong> You see only:</p>
                        <ul>
                            <li>✅ ELIGIBLE or ❌ NOT ELIGIBLE</li>
                            <li>Proof ID (reference only)</li>
                            <li>Submission timestamp</li>
                        </ul>
                        <p>You see NOTHING about:</p>
                        <ul>
                            <li>✗ Student name, identity, or any personal data</li>
                            <li>✗ Which institutions issued their credentials</li>
                            <li>✗ Exact values of any field (GPA, experience, etc.)</li>
                        </ul>
                    </div>
                    <div id="candidates-list" class="card">
                        <div class="candidate-result">
                            <h3>Proof: proof_abc123</h3>
                            <p><strong>Status:</strong> ✅ ELIGIBLE</p>
                            <p><strong>Submitted:</strong> 2025-02-25 14:32 UTC</p>
                            <button class="btn btn-secondary">View SBT (Non-Transferable Token)</button>
                        </div>
                        <div class="candidate-result">
                            <h3>Proof: proof_xyz789</h3>
                            <p><strong>Status:</strong> ❌ NOT ELIGIBLE</p>
                            <p><strong>Submitted:</strong> 2025-02-25 13:15 UTC</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;

    // Tab switching
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).getAttribute('data-tab');
            if (target) switchTab(target);
        });
    });

    // Post requirement form
    document.getElementById('req-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const employer = (document.getElementById('employer-address') as HTMLInputElement).value;
        const description = (document.getElementById('job-description') as HTMLTextAreaElement).value;
        const gpaMin = parseFloat((document.getElementById('gpa-min') as HTMLInputElement).value);
        const cloudCertified = (document.getElementById('cloud-certified') as HTMLInputElement).checked;
        const yearsMin = parseInt((document.getElementById('years-min') as HTMLInputElement).value);
        const gradYearMin = parseInt((document.getElementById('grad-year-min') as HTMLInputElement).value);
        
        try {
            const result = await postRequirement(employer, description, gpaMin, cloudCertified, yearsMin, gradYearMin);
            const resultBox = document.getElementById('req-result');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="success">
                        ✅ Requirement posted successfully!<br>
                        <strong>Commitment Hash:</strong> ${result.requirement_hash}<br>
                        <br>
                        <strong>What candidates will see:</strong>
                        <ul style="margin-top: 10px;">
                            <li>✓ Hash: ${result.requirement_hash}</li>
                            <li>✓ NO actual requirements</li>
                        </ul>
                        <br>
                        <strong>What you'll see from candidates:</strong>
                        <ul style="margin-top: 10px;">
                            <li>✓ ✅ ELIGIBLE or ❌ NOT ELIGIBLE</li>
                            <li>✗ NO personal data</li>
                            <li>✗ NO field values</li>
                        </ul>
                        <br>
                        Share this hash with candidates: <code>${result.requirement_hash}</code>
                    </div>
                `;
            }
        } catch (error) {
            const resultBox = document.getElementById('req-result');
            if (resultBox) {
                resultBox.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
            }
        }
    });

    // View requirements
    document.getElementById('view-reqs-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const employer = (document.getElementById('employer-address-view') as HTMLInputElement).value;
        
        try {
            const result = await getEmployerRequirements(employer);
            const list = document.getElementById('requirements-list');
            if (list) {
                if (result.requirements.length === 0) {
                    list.innerHTML = '<p class="text-muted">No requirements posted yet.</p>';
                } else {
                    let html = '<div class="requirements">';
                    result.requirements.forEach((req: any) => {
                        html += `
                            <div class="requirement-card">
                                <h3>&quot;${req.description}&quot;</h3>
                                <p><strong>Hash:</strong> ${req.hash}</p>
                                <p><strong>Criteria:</strong> GPA≥${req.gpa_min}, Exp≥${req.years_experience_min}y, Cloud=${req.cloud_certified}</p>
                                <p><strong>Applications:</strong> ${req.candidates_applied}</p>
                                <small>Posted: ${new Date(req.created_at).toLocaleDateString()}</small>
                            </div>
                        `;
                    });
                    html += '</div>';
                    list.innerHTML = html;
                }
            }
        } catch (error) {
            const list = document.getElementById('requirements-list');
            if (list) {
                list.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
            }
        }
    });
}

function switchTab(tabName: string) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) tab.classList.add('active');
    
    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');
}
