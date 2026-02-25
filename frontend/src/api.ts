/**
 * Frontend utilities for NexusCred
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiCall(
    endpoint: string, 
    method: string = 'GET',
    data?: any
): Promise<any> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API request failed: ${endpoint}`, error);
        throw error;
    }
}

export async function getWorkflow() {
    return apiCall('/api/workflow');
}

export async function registerIssuer(address: string, name: string) {
    return apiCall('/api/issuer/register', 'POST', { issuer_address: address, issuer_name: name });
}

export async function getIssuer(address: string) {
    return apiCall(`/api/issuer/${address}`);
}

export async function createBatch(issuer: string, credentials: any[]) {
    return apiCall('/api/issuer/batch/create', 'POST', { issuer, credentials });
}

export async function getBatch(batchId: string) {
    return apiCall(`/api/batch/${batchId}`);
}

export async function anchorBatch(batchId: string) {
    return apiCall(`/api/batch/${batchId}/anchor`, 'POST');
}

export async function getStudentCredentials(studentId: string) {
    return apiCall(`/api/student/${studentId}/credentials`);
}

export async function generateProof(studentId: string, requirementHash: string) {
    return apiCall(`/api/student/${studentId}/proof/generate`, 'POST', { requirement_hash: requirementHash });
}

export async function postRequirement(employer: string, description: string, gpa_min: number, cloud_certified: boolean, years_experience_min: number, grad_year_min: number) {
    return apiCall('/api/employer/requirement', 'POST', {
        employer,
        description,
        gpa_min,
        cloud_certified,
        years_experience_min,
        grad_year_min
    });
}

export async function getEmployerRequirements(employer: string) {
    return apiCall(`/api/employer/${employer}/requirements`);
}

export async function verifyProof(studentId: string, requirementHash: string, proofData: any) {
    return apiCall('/api/proof/verify', 'POST', {
        student_id: studentId,
        requirement_hash: requirementHash,
        proof_data: proofData,
        public_signals: [requirementHash]
    });
}

export async function getProofStatus(proofId: string) {
    return apiCall(`/api/proof/${proofId}`);
}

export async function getSystemStatus() {
    return apiCall('/api/status');
}
