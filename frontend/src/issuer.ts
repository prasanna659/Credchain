/**
 * Issuer Dashboard
 * UI for credential issuers: IIT, AWS, Infosys, etc.
 * 
 * Features:
 * - Register as issuer (stake MATIC)
 * - Create credential batches
 * - Review fraud scores
 * - Anchor to blockchain
 * - Distribute VCs
 */

import { registerIssuer, createBatch, anchorBatch } from './api';

export async function renderIssuerDashboard() {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
        <div class="dashboard">
            <aside class="sidebar">
                <div class="logo">🏛️ ISSUER Dashboard</div>
                <nav class="nav-menu">
                    <button class="nav-item active" data-tab="register">Register</button>
                    <button class="nav-item" data-tab="create-batch">Create Batch</button>
                    <button class="nav-item" data-tab="manage-batches">Manage Batches</button>
                </nav>
            </aside>

            <main class="dashboard-main">
                <!-- Register Tab -->
                <section id="register-tab" class="tab-content active">
                    <h2>Register as Credential Issuer</h2>
                    <form id="register-form" class="card">
                        <div class="form-group">
                            <label>Issuer Address (wallet)</label>
                            <input 
                                type="text" 
                                id="issuer-address" 
                                placeholder="0x..." 
                                value="0x1234567890123456789012345678901234567890"
                            />
                        </div>
                        <div class="form-group">
                            <label>Issuer Name</label>
                            <input 
                                type="text" 
                                id="issuer-name" 
                                placeholder="e.g., IIT Delhi" 
                                value="IIT Delhi"
                            />
                        </div>
                        <div class="form-group">
                            <label>Stake Amount</label>
                            <input 
                                type="text" 
                                id="stake-amount" 
                                placeholder="1000 MATIC" 
                                value="1000 MATIC" 
                                disabled
                            />
                            <small>Minimum: 1000 MATIC (economic fraud deterrent)</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Register & Stake</button>
                    </form>
                    <div id="register-result" class="result-box"></div>
                </section>

                <!-- Create Batch Tab -->
                <section id="create-batch-tab" class="tab-content">
                    <h2>Create Credential Batch</h2>
                    <form id="batch-form" class="card">
                        <div class="form-group">
                            <label>Issuer Address</label>
                            <input type="text" id="batch-issuer" placeholder="0x..." value="0x1234567890123456789012345678901234567890" />
                        </div>
                        <div class="form-group">
                            <label>Credentials (JSON)</label>
                            <textarea 
                                id="credentials-json" 
                                rows="8" 
                                placeholder='[{"student_id":"S001","student_name":"Ravi Kumar","fields":[...]}]'
                            ></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Batch & Calculate Merkle Root</button>
                    </form>
                    <div id="batch-result" class="result-box"></div>
                </section>

                <!-- Manage Batches Tab -->
                <section id="manage-batches-tab" class="tab-content">
                    <h2>Manage Credential Batches</h2>
                    <div id="batches-list" class="card"></div>
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

    // Register form submission
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const address = (document.getElementById('issuer-address') as HTMLInputElement).value;
        const name = (document.getElementById('issuer-name') as HTMLInputElement).value;
        
        try {
            const result = await registerIssuer(address, name);
            const resultBox = document.getElementById('register-result');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="success">
                        ✅ ${result.message}<br>
                        <strong>ISSUER_ROLE granted</strong><br>
                        Stake: 1000 MATIC locked in IssuerVault
                    </div>
                `;
            }
        } catch (error) {
            const resultBox = document.getElementById('register-result');
            if (resultBox) {
                resultBox.innerHTML = `<div class="error">❌ Registration failed: ${error}</div>`;
            }
        }
    });

    // Batch form submission
    document.getElementById('batch-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const issuer = (document.getElementById('batch-issuer') as HTMLInputElement).value;
        const jsonStr = (document.getElementById('credentials-json') as HTMLTextAreaElement).value;
        
        try {
            const credentials = JSON.parse(jsonStr);
            const result = await createBatch(issuer, credentials);
            const resultBox = document.getElementById('batch-result');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="success">
                        ✅ Batch created: ${result.batch_id}<br>
                        <strong>Merkle Root:</strong> ${result.merkle_root}<br>
                        <strong>Fraud Score:</strong> ${(result.fraud_score * 100).toFixed(1)}%<br>
                        <strong>Credentials:</strong> ${result.message}<br>
                        <br>
                        <button onclick="anchorBatchNow('${result.batch_id}')" class="btn btn-secondary">Anchor to Blockchain</button>
                    </div>
                `;
            }
        } catch (error) {
            const resultBox = document.getElementById('batch-result');
            if (resultBox) {
                resultBox.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
            }
        }
    });

    // Expose anchorBatchNow to global scope
    (window as any).anchorBatchNow = async (batchId: string) => {
        try {
            const result = await anchorBatch(batchId);
            const resultBox = document.getElementById('batch-result');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="success">
                        ✅ Batch anchored to blockchain!<br>
                        <strong>TX Hash:</strong> ${result.tx_hash}<br>
                        <strong>VCs Created:</strong> ${result.vcs_created}<br>
                        VCs are now distributed to students' wallets
                    </div>
                `;
            }
        } catch (error) {
            alert(`Anchor failed: ${error}`);
        }
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
