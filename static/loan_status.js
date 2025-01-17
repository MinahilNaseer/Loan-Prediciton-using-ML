fetch("static/cleaned_loan_data.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").slice(1); // Skip header
                const tableBody = document.querySelector("table tbody");

                rows.forEach(row => {
                    const cols = row.split(",");
                    if (cols.length > 1) {
                        const tr = document.createElement("tr");
                        cols.forEach(col => {
                            const td = document.createElement("td");
                            td.textContent = col.trim();
                            tr.appendChild(td);
                        });
                        tableBody.appendChild(tr);
                    }
                });
            });