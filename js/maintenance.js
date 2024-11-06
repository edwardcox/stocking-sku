// maintenance.js
class SizeTableEditor {
    constructor() {
        this.currentTable = 'thigh_length';
        this.currentType = 'Normal';
        this.originalData = null;
        this.currentData = null;
        this.hasChanges = false;

        this.initializeEditor();
        this.setupHistoryViewer();
    }

    async initializeEditor() {
        try {
            // First, fetch and evaluate the sizeLookup.js file
            const response = await fetch('js/sizeLookup.js');
            const jsContent = await response.text();
            
            // Create a temporary function to safely evaluate the JS and get the data
            const getTempData = new Function(`
                ${jsContent}
                return sizeLookupTable;
            `);
            
            // Get the data by executing the function
            this.originalData = getTempData();
            this.currentData = JSON.parse(JSON.stringify(this.originalData));
            
            this.renderTable();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading size table:', error);
            alert('Error loading size table data. Please check the console for details.');
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTable(e.target.dataset.table);
            });
        });

        // Length type selection
        document.getElementById('lengthType').addEventListener('change', (e) => {
            this.currentType = e.target.value;
            this.renderTable();
        });

        // Save button
        document.getElementById('saveChanges').addEventListener('click', () => {
            this.saveChanges();
        });

        // Cancel button
        document.getElementById('cancelChanges').addEventListener('click', () => {
            this.cancelChanges();
        });
    }

    setupHistoryViewer() {
        const modal = document.getElementById('historyModal');
        const closeButtons = document.querySelectorAll('#closeHistory, #closeHistoryButton');
        const viewHistoryBtn = document.getElementById('viewHistory');

        // Show modal
        viewHistoryBtn.addEventListener('click', () => {
            this.loadHistory();
            modal.classList.remove('hidden');
        });

        // Close modal
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    switchTable(tableType) {
        // Update active tab styling
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('text-gray-500', 'border-transparent');
        });
        const activeBtn = document.querySelector(`[data-table="${tableType}"]`);
        activeBtn.classList.add('border-blue-500', 'text-blue-600');
        activeBtn.classList.remove('text-gray-500', 'border-transparent');

        this.currentTable = tableType;
        this.renderTable();
    }

    renderTable() {
        const table = document.getElementById('sizeTable');
        const data = this.currentData[this.currentTable][this.currentType];

        // Create table header
        let html = `
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ankle (cm)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calf (cm)</th>
                    ${this.currentTable === 'thigh_length' ? 
                        '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thigh (cm)</th>' : ''}
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length (cm)</th>
                    ${this.currentTable === 'thigh_length' ? 
                        '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">G Range (cm)</th>' : ''}
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">`;

        // Create table rows
        data.forEach((row, index) => {
            html += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.Size}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" 
                               data-field="A" 
                               data-size="${index}"
                               value="${row.A_min}-${row.A_max}"
                               class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" 
                               data-field="B" 
                               data-size="${index}"
                               value="${row.B_min}-${row.B_max}"
                               class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </td>`;
            
            if (this.currentTable === 'thigh_length') {
                html += `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" 
                               data-field="C" 
                               data-size="${index}"
                               value="${row.C_min}-${row.C_max}"
                               class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </td>`;
            }

            html += `
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="text" 
                           data-field="D" 
                           data-size="${index}"
                           value="${row.D_min}-${row.D_max}"
                           class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </td>`;

            if (this.currentTable === 'thigh_length') {
                html += `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="text" 
                               data-field="G" 
                               data-size="${index}"
                               value="${row.G_min}-${row.G_max}"
                               class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </td>`;
            }

            html += '</tr>';
        });

        html += '</tbody>';
        table.innerHTML = html;

        // Add input event listeners
        table.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => this.handleInputChange(e));
            input.addEventListener('input', (e) => this.validateInput(e.target));
        });
    }

    validateInput(input) {
        const value = input.value;
        const pattern = /^\d+(\.\d+)?-\d+(\.\d+)?$/;
        
        if (!pattern.test(value)) {
            input.classList.add('border-red-500');
            return false;
        }
        
        const [min, max] = value.split('-').map(Number);
        if (min >= max) {
            input.classList.add('border-red-500');
            return false;
        }

        input.classList.remove('border-red-500');
        return true;
    }

    handleInputChange(event) {
        const input = event.target;
        if (!this.validateInput(input)) {
            return;
        }

        const field = input.dataset.field;
        const sizeIndex = parseInt(input.dataset.size);
        const [min, max] = input.value.split('-').map(Number);

        // Update the current data
        this.currentData[this.currentTable][this.currentType][sizeIndex][`${field}_min`] = min;
        this.currentData[this.currentTable][this.currentType][sizeIndex][`${field}_max`] = max;

        this.hasChanges = true;
    }

    async saveChanges() {
        if (!this.validateAllInputs()) {
            alert('Please correct all validation errors before saving.');
            return;
        }

        try {
            const response = await fetch('save_table.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: this.currentData
                })
            });

            const result = await response.json();
            if (result.success) {
                this.originalData = JSON.parse(JSON.stringify(this.currentData));
                this.hasChanges = false;
                alert('Changes saved successfully!');
            } else {
                throw new Error(result.message || 'Error saving changes');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error saving changes. Please check the console for details.');
        }
    }

    validateAllInputs() {
        let isValid = true;
        document.querySelectorAll('#sizeTable input').forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    cancelChanges() {
        if (this.hasChanges) {
            if (confirm('Are you sure you want to discard your changes?')) {
                this.currentData = JSON.parse(JSON.stringify(this.originalData));
                this.renderTable();
                this.hasChanges = false;
            }
        }
    }

    async loadHistory() {
        try {
            const response = await fetch('get_history.php');
            const data = await response.json();
            
            if (data.success) {
                this.displayHistory(data.history);
            } else {
                throw new Error(data.message || 'Failed to load history');
            }
        } catch (error) {
            console.error('Error loading history:', error);
            alert('Error loading backup history. Please check the console for details.');
        }
    }

    displayHistory(history) {
        const historyContent = document.getElementById('historyContent');
        
        if (history.length === 0) {
            historyContent.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    No backup history available
                </div>
            `;
            return;
        }

        const historyHTML = history.map(entry => `
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-sm font-medium text-gray-900">${entry.filename}</h4>
                        <p class="text-sm text-gray-500">${entry.date}</p>
                        <p class="text-sm text-gray-500">Size: ${entry.size}</p>
                        ${entry.log ? `<p class="text-sm text-gray-600 mt-2">${entry.log}</p>` : ''}
                    </div>
                    <button onclick="window.open('${entry.path}', '_blank')" 
                            class="text-blue-600 hover:text-blue-800 text-sm">
                        View File
                    </button>
                </div>
            </div>
        `).join('');

        historyContent.innerHTML = historyHTML;
    }
}

// Initialize the editor when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SizeTableEditor();
});