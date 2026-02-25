/**
 * Student Wallet & Proof Generation
 * UI for students to:
 * - View their VCs from multiple issuers
 * - See eligible job opportunities
 * - Generate ZK proofs
 * - Receive SBTs
 */

import { getStudentCredentials, generateProof, verifyProof } from './api';

export async function renderStudentDashboard() {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
        <div class="dashboard">
            <aside class="sidebar">
                <div class="logo">🎓 STUDENT Wallet</div>
                <nav class="nav-menu">
                    <button class="nav-item active" data-tab="credentials">My Credentials</button>
                    <button class="nav-item" data-tab="eligible-jobs">Eligible Jobs</button>
                    <button class="nav-item" data-tab="generate-proof">Generate Proof</button>
                    <button class="nav-item" data-tab="my-sbts">My SBTs</button>
                </nav>
            </aside>

            <main class="dashboard-main">
                <!-- My Credentials Tab -->
                <section id="credentials-tab" class="tab-content active">
                    <h2>My Verifiable Credentials (VCs)</h2>
                    <form id="fetch-creds-form" class="card">
                        <div class="form-group">
                            <label>Student ID</label>
                            <input 
                                type="text" 
                                id="student-id-creds" 
                                placeholder="e.g., S001" 
                                value="S001"
                            />
                        </div>
                        <button type="submit" class="btn btn-primary">Fetch My Credentials</button>
                    </form>
                    <div id="credentials-list" class="card"></div>
                </section>

                <!-- Eligible Jobs Tab -->
                <section id="eligible-jobs-tab" class="tab-content">
                    <h2>Eligible Job Opportunities</h2>
                    <p>Based on your credentials, these employers have posted blind job requirements you may qualify for:</p>
                    <div id="jobs-list" class="card">
                        <div class="job-card">
                            <h3>Google - Senior ML Engineer</h3>
                            <p>🔒 Requirements hidden (blind matching)</p>
                            <button onclick="checkEligibility()" class="btn btn-secondary">Check Eligibility</button>
                        </div>
                        <div class="job-card">
                            <h3>TCS - Cloud Architect</h3>
                            <p>🔒 Requirements hidden (blind matching)</p>
                            <button class="btn btn-secondary">Check Eligibility</button>
                        </div>
                    </div>
                </section>

                <!-- Generate Proof Tab -->
                <section id="generate-proof-tab" class="tab-content">
                    <h2>Generate ZK Proof of Eligibility</h2>
                    <form id="proof-form" class="card">
                        <div class="form-group">
                            <label>Student ID</label>
                            <input type="text" id="student-id-proof" placeholder="e.g., S001" value="S001" />
                        </div>
                        <div class="form-group">
                            <label>Requirement Commitment Hash</label>
                            <input 
                                type="text" 
                                id="req-hash" 
                                placeholder="0x..." 
                                value="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                            />
                            <small>This hash represents the employer's requirements (you never see the actual requirements)</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Generate Proof (Local, Private)</button>
                    </form>
                    <div id="proof-result" class="result-box"></div>
                </section>

                <!-- My SBTs Tab -->
                <section id="my-sbts-tab" class="tab-content">
                    <h2>My Soulbound Tokens (SBTs)</h2>
                    <div id="sbts-list" class="card">
                        <p>Soulbound tokens (ERC-5192) are non-transferable proof of your verified eligibility.</p>
                        <p class="text-muted">Generate proofs to receive SBTs</p>
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

    // Fetch credentials
    document.getElementById('fetch-creds-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = (document.getElementById('student-id-creds') as HTMLInputElement).value;
        
        try {
            const result = await getStudentCredentials(studentId);
            const list = document.getElementById('credentials-list');
            if (list) {
                if (result.credentials.length === 0) {
                    list.innerHTML = '<p class="text-muted">No credentials found. Ask issuers to issue credentials.</p>';
                } else {
                    let html = '<div class="credentials">';
                    result.credentials.forEach((vc: any, i: number) => {
                        html += `
                            <div class="credential-card">
                                <h3>#${i + 1} ${vc.credential_type} from ${vc.issuer}</h3>
                                <p><strong>Student:</strong> ${vc.credential_data.student_name}</p>
                                <p><strong>Merkle Root:</strong> ${vc.merkle_root.substring(0, 20)}...</p>
                                <p><strong>Proof Path Depth:</strong> ${vc.merkle_path.length}</p>
                                <small>Issued: ${new Date(vc.issued_at * 1000).toLocaleDateString()}</small>
                            </div>
                        `;
                    });
                    html += '</div>';
                    list.innerHTML = html;
                }
            }
        } catch (error) {
            const list = document.getElementById('credentials-list');
            if (list) {
                list.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
            }
        }
    });

    // Generate proof
    document.getElementById('proof-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = (document.getElementById('student-id-proof') as HTMLInputElement).value;
        const reqHash = (document.getElementById('req-hash') as HTMLInputElement).value;
        
        try {
            const result = await generateProof(studentId, reqHash);
            const resultBox = document.getElementById('proof-result');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="success">
                        ✅ Proof generated successfully!<br>
                        <strong>Proof ID:</strong> ${result.proof_id}<br>
                        <strong>Credentials Used:</strong> ${result.message}<br>
                        <br>
                        <strong>What just happened (all on your device):</strong>
                        <ul style="margin-top: 10px;">
                            <li>✓ Verified your credentials against issuers' Merkle roots</li>
                            <li>✓ Checked all your fields against employer's hidden requirements</li>
                            <li>✓ Generated Groth16 ZK proof</li>
                        </ul>
                        <br>
                        <strong>What the employer will learn:</strong>
                        <ul style="margin-top: 10px;">
                            <li>✓ ELIGIBLE or NOT ELIGIBLE</li>
                        </ul>
                        <strong>What they will NOT learn:</strong>
                        <ul style="margin-top: 10px;">
                            <li>✗ Your GPA, salary, name, or any field value</li>
                            <li>✗ Which issuers you have credentials from</li>
                            <li>✗ When you earned credentials</li>
                        </ul>
                        <br>
                        <button onclick="submitProof('${result.proof_id}', '${reqHash}')" class="btn btn-secondary">
                            Submit Proof to Employer
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            const resultBox = document.getElementById('proof-result');
            if (resultBox) {
                resultBox.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
            }
        }
    });

    // Expose functions to global scope
    (window as any).submitProof = async (proofId: string, reqHash: string) => {
        try {
            const result = await verifyProof((document.getElementById('student-id-proof') as HTMLInputElement).value, reqHash, { id: proofId });
            const resultBox = document.getElementById('proof-result');
            if (resultBox) {
                resultBox.innerHTML += `
                    <div class="success" style="margin-top: 20px;">
                        ✅ Proof submitted and verified on blockchain!<br>
                        <strong>Result:</strong> ${result.eligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}<br>
                        <strong>SBT Token ID:</strong> ${result.sbt_token_id}<br>
                        <br>
                        Your ERC-5192 Soulbound Token has been minted to your wallet.
                    </div>
                `;
            }
        } catch (error) {
            alert(`Proof submission failed: ${error}`);
        }
    };

    (window as any).checkEligibility = () => {
        switchTab('generate-proof');
        alert('Paste a requirement hash to check eligibility');
    };
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
