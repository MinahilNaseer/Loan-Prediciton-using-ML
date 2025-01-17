function showForm() {
    const heroRight = document.getElementById('hero-right');
    heroRight.innerHTML = `
        <h2>Loan Application Form</h2>
        <form action="/predict" method="POST" id="loanForm">
            <div class="form-group">
                <label for="Name">Name:</label>
                <input type="text" name="name" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
                <label for="applicantIncome">Applicant Income:</label>
                <input type="number" id="applicantIncome" name="applicantIncome" required>
            </div>
            <div class="form-group">
                <label for="coapplicantIncome">Coapplicant Income:</label>
                <input type="number" id="coapplicantIncome" name="coapplicantIncome" required>
            </div>
            <div class="form-group">
                <label for="loanAmount">Loan Amount:</label>
                <input type="number" id="loanAmount" name="loanAmount" required>
            </div>
            <div class="form-group">
                <label for="loanTerm">Loan Amount Term (in months):</label>
                <input type="number" id="loanTerm" name="loanTerm" required>
            </div>
            <div class="form-group">
                <label for="creditHistory">Credit History:</label>
                <select id="creditHistory" name="creditHistory" required>
                    <option value="1">Good (1)</option>
                    <option value="0">Bad (0)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="gender">Gender:</label>
                <select id="gender" name="gender" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div class="form-group">
                <label for="married">Married:</label>
                <select id="married" name="married" required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div class="form-group">
                <label for="dependents">Number of Dependents:</label>
                <select id="dependents" name="dependents" required>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                </select>
            </div>
            <div class="form-group">
                <label for="education">Education Level:</label>
                <select id="education" name="education" required>
                    <option value="Graduate">Graduate</option>
                    <option value="Not Graduate">Not Graduate</option>
                </select>
            </div>
            <div class="form-group">
                <label for="selfEmployed">Self Employed:</label>
                <select id="selfEmployed" name="selfEmployed" required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div class="form-group">
                <label for="propertyArea">Property Area:</label>
                <select id="propertyArea" name="propertyArea" required>
                    <option value="Urban">Urban</option>
                    <option value="Semiurban">Semiurban</option>
                    <option value="Rural">Rural</option>
                </select>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-success">Submit Application</button>
            </div>
        </form>

        <!-- Modal for displaying the result -->
        <div class="modal fade" id="resultModal" tabindex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="resultModalLabel">Loan Prediction Result</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="resultMessage">Loading...</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach event listener to form submission
    const form = document.getElementById('loanForm');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const result = await response.json(); // Assume /predict returns JSON with result
        document.getElementById('resultMessage').textContent = result.message;

        // Reset form fields to their initial values
        form.reset();

        // Set default values where necessary
        document.getElementById('applicantIncome').value = 0;
        document.getElementById('coapplicantIncome').value = 0;
        document.getElementById('loanAmount').value = 0;
        document.getElementById('loanTerm').value = 0;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('resultModal'));
        modal.show();
    });
}
