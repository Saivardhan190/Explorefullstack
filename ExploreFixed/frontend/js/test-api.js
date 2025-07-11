// Test script to verify backend authentication and API endpoints

document.addEventListener('DOMContentLoaded', async function() {
  const testResultsContainer = document.getElementById('testResults');
  
  if (!testResultsContainer) {
    console.error('Test results container not found');
    return;
  }
  
  testResultsContainer.innerHTML = '<h2>Running API Tests...</h2>';
  
  const results = [];
  
  // Test 1: Test CORS and API connection
  try {
    const response = await fetch('http://localhost:5000/api/v1/packages');
    const data = await response.json();
    
    results.push({
      name: 'CORS and API Connection',
      status: response.ok ? 'PASS' : 'FAIL',
      details: response.ok ? 'Successfully connected to API' : `Failed with status: ${response.status}`
    });
  } catch (error) {
    results.push({
      name: 'CORS and API Connection',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Test 2: User Registration
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const response = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    results.push({
      name: 'User Registration',
      status: response.ok ? 'PASS' : 'FAIL',
      details: response.ok ? 'Successfully registered user' : `Failed with status: ${response.status} - ${data.error || 'Unknown error'}`
    });
    
    // Store token for subsequent tests
    if (response.ok && data.token) {
      localStorage.setItem('testToken', data.token);
      localStorage.setItem('testUser', JSON.stringify(data.data));
    }
  } catch (error) {
    results.push({
      name: 'User Registration',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Test 3: User Login
  try {
    const testUser = JSON.parse(localStorage.getItem('testUser'));
    
    if (!testUser) {
      throw new Error('No test user available');
    }
    
    const loginData = {
      email: testUser.email,
      password: 'password123'
    };
    
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const data = await response.json();
    
    results.push({
      name: 'User Login',
      status: response.ok ? 'PASS' : 'FAIL',
      details: response.ok ? 'Successfully logged in' : `Failed with status: ${response.status} - ${data.error || 'Unknown error'}`
    });
    
    // Update token for subsequent tests
    if (response.ok && data.token) {
      localStorage.setItem('testToken', data.token);
    }
  } catch (error) {
    results.push({
      name: 'User Login',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Test 4: Get Current User
  try {
    const token = localStorage.getItem('testToken');
    
    if (!token) {
      throw new Error('No auth token available');
    }
    
    const response = await fetch('http://localhost:5000/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    results.push({
      name: 'Get Current User',
      status: response.ok ? 'PASS' : 'FAIL',
      details: response.ok ? 'Successfully retrieved user data' : `Failed with status: ${response.status} - ${data.error || 'Unknown error'}`
    });
  } catch (error) {
    results.push({
      name: 'Get Current User',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Test 5: Get Packages
  try {
    const response = await fetch('http://localhost:5000/api/v1/packages');
    const data = await response.json();
    
    results.push({
      name: 'Get Packages',
      status: response.ok ? 'PASS' : 'FAIL',
      details: response.ok ? `Successfully retrieved ${data.data ? data.data.length : 0} packages` : `Failed with status: ${response.status} - ${data.error || 'Unknown error'}`
    });
  } catch (error) {
    results.push({
      name: 'Get Packages',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Display test results
  let resultsHTML = '<h2>API Test Results</h2>';
  resultsHTML += '<div class="test-summary">';
  
  const passedTests = results.filter(r => r.status === 'PASS').length;
  resultsHTML += `<div class="test-summary-item passed">Passed: ${passedTests}/${results.length}</div>`;
  resultsHTML += `<div class="test-summary-item failed">Failed: ${results.length - passedTests}/${results.length}</div>`;
  resultsHTML += '</div>';
  
  resultsHTML += '<div class="test-results">';
  results.forEach(result => {
    resultsHTML += `
      <div class="test-result ${result.status.toLowerCase()}">
        <div class="test-header">
          <h3>${result.name}</h3>
          <span class="test-status ${result.status.toLowerCase()}">${result.status}</span>
        </div>
        <div class="test-details">
          <p>${result.details}</p>
        </div>
      </div>
    `;
  });
  resultsHTML += '</div>';
  
  testResultsContainer.innerHTML = resultsHTML;
});
