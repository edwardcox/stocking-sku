// main.js

class SKUInterface {
    constructor() {
        this.skuGenerator = new SKUGenerator();
        this.initializeInterface();
    }

    initializeInterface() {
        // Initialize core elements
        this.generateSKUButton = document.querySelector('#generate-sku');
        this.copySKUButton = document.querySelector('#copy-sku');
        this.form = document.querySelector('#sku-form');
        this.resultContainer = document.querySelector('#result');

        // Initialize tooltips
        this.initializeTooltips();
        
        // Attach event listeners
        this.attachEventListeners();

        // Initially disable the Copy SKU button
        this.updateCopyButtonStyle(false);
    }

    initializeTooltips() {
        const measurementTooltips = {
            ankle: "Measure around the narrowest part of your ankle",
            calf: "Measure around the widest part of your calf muscle",
            thigh: "Measure around the widest part of your thigh",
            legLength: "Measure from the floor to the desired stocking height"
        };

        Object.entries(measurementTooltips).forEach(([id, content]) => {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) {
                label.classList.add('cursor-help', 'inline-flex', 'items-center');
                const icon = document.createElement('span');
                icon.innerHTML = `<svg class="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>`;
                label.appendChild(icon);
                
                tippy(label, {
                    content: content,
                    theme: 'custom',
                    placement: 'right'
                });
            }
        });
    }

    attachEventListeners() {
        if (this.generateSKUButton) {
            // Remove any existing listeners
            const newButton = this.generateSKUButton.cloneNode(true);
            this.generateSKUButton.parentNode.replaceChild(newButton, this.generateSKUButton);
            this.generateSKUButton = newButton;
            
            // Add new listener
            this.generateSKUButton.addEventListener('click', () => this.handleGenerateSKU());
        }

        if (this.copySKUButton) {
            // Remove any existing listeners
            const newCopyButton = this.copySKUButton.cloneNode(true);
            this.copySKUButton.parentNode.replaceChild(newCopyButton, this.copySKUButton);
            this.copySKUButton = newCopyButton;
            
            // Add new listener
            this.copySKUButton.addEventListener('click', () => this.handleCopySKU());
        }
    }

    updateCopyButtonStyle(isEnabled) {
        if (!this.copySKUButton) return;
        
        this.copySKUButton.disabled = !isEnabled;
        if (isEnabled) {
            this.copySKUButton.classList.remove('bg-gray-400', 'hover:bg-gray-500');
            this.copySKUButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        } else {
            this.copySKUButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            this.copySKUButton.classList.add('bg-gray-400', 'hover:bg-gray-500');
        }
    }

    getFormData() {
        if (!this.form) return null;

        const getInputValue = (id) => {
            const input = this.form.querySelector('#' + id);
            if (!input) {
                throw new Error(`Input field #${id} not found`);
            }
            return input.value;
        };

        try {
            return {
                length: getInputValue('length'),
                color: getInputValue('color'),
                toe: getInputValue('toe'),
                classType: getInputValue('class'),
                ankle: parseFloat(getInputValue('ankle')),
                calf: parseFloat(getInputValue('calf')),
                thigh: parseFloat(getInputValue('thigh')),
                legLength: parseFloat(getInputValue('legLength'))
            };
        } catch (error) {
            console.error('Error getting form data:', error);
            throw error;
        }
    }

    handleGenerateSKU() {
        try {
            // Validate form data
            const formData = this.getFormData();
            if (!formData) {
                throw new Error('Unable to get form data');
            }

            // Validate numeric inputs
            const numericFields = ['ankle', 'calf', 'thigh', 'legLength'];
            for (const field of numericFields) {
                if (isNaN(formData[field])) {
                    throw new Error(`Please enter a valid number for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                }
            }

            const skuData = this.skuGenerator.generateSKU(
                formData.length,
                formData.color,
                formData.toe,
                formData.classType,
                formData.ankle,
                formData.calf,
                formData.thigh,
                formData.legLength
            );

            this.updateResults(skuData, formData);
            this.updateCopyButtonStyle(true);

            // Send data to parent window if in popup
            if (window.opener) {
                window.opener.postMessage({
                    type: 'SKU_GENERATED',
                    ...skuData,
                    ...formData
                }, '*');
            }

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.message.includes('out of range') 
                ? `Measurement ${error.message.toLowerCase()}`
                : error.message;
            alert(errorMessage);
        }
    }

    handleCopySKU() {
        const skuValue = document.querySelector('#sku-value')?.textContent;
        if (skuValue && skuValue !== '-') {
            navigator.clipboard.writeText(skuValue)
                .then(() => {
                    // Show temporary success message
                    const originalText = this.copySKUButton.textContent;
                    this.copySKUButton.textContent = 'Copied!';
                    this.copySKUButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    this.copySKUButton.classList.add('bg-green-600', 'hover:bg-green-700');
                    
                    setTimeout(() => {
                        this.copySKUButton.textContent = originalText;
                        this.copySKUButton.classList.remove('bg-green-600', 'hover:bg-green-700');
                        this.copySKUButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy SKU: ', err);
                    alert('Failed to copy SKU. Please copy it manually.');
                });
        }
    }

    updateResults(skuData, formData) {
        const updateElementText = (selector, value) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
            }
        };

        // Update basic information
        updateElementText('#sku-value', skuData.sku || '-');
        updateElementText('#initial-size', 
            skuData.size ? (skuData.size + (skuData.isGPlus ? " G+" : "")) : '-');
        updateElementText('#leg-length-type', skuData.legLengthType || '-');

        // Calculate and update confidence score
        const confidence = this.skuGenerator.calculateConfidenceScore(
            formData.ankle,
            formData.calf,
            formData.thigh,
            formData.legLength,
            skuData.size,
            skuData.legLengthType
        );

        // Update confidence score and message
        const confidenceElement = document.getElementById('confidence-score');
        const confidenceMessageElement = document.getElementById('confidence-message');
        const measurementAnalysis = document.getElementById('measurement-analysis');
        const deviationBreakdown = document.getElementById('deviation-breakdown');
        const improvementList = document.getElementById('improvement-list');
        
        if (confidenceElement && confidenceMessageElement) {
            // Add color classes based on confidence score
            const getConfidenceColor = (score) => {
                if (score >= 75) return 'text-green-600';
                if (score >= 60) return 'text-yellow-600';
                return 'text-red-600';
            };

            confidenceElement.textContent = `${confidence.score}%`;
            confidenceElement.className = `result-value ${getConfidenceColor(confidence.score)}`;

            // Set the detailed message
            confidenceMessageElement.textContent = confidence.message;
            confidenceMessageElement.className = `text-sm mt-2 ${getConfidenceColor(confidence.score)}`;

            // Show measurement analysis if score is less than 100
            if (confidence.score < 100 && measurementAnalysis) {
                measurementAnalysis.classList.remove('hidden');

                // Clear previous content
                deviationBreakdown.innerHTML = '';
                improvementList.innerHTML = '';

                // Add deviation bars
                confidence.deviations.forEach(d => {
                    const deviationPercentage = Math.min(Math.round(d.deviation * 100), 100);
                    const barColor = deviationPercentage <= 10 ? 'bg-green-500' : 
                                   deviationPercentage <= 20 ? 'bg-yellow-500' : 'bg-red-500';

                    const barHtml = `
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-700 w-20">${d.name}</span>
                            <div class="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div class="${barColor} h-2.5 rounded-full" 
                                     style="width: ${deviationPercentage}%"></div>
                            </div>
                            <span class="text-sm text-gray-600">${deviationPercentage}%</span>
                        </div>
                    `;
                    deviationBreakdown.insertAdjacentHTML('beforeend', barHtml);
                });

                // Add improvement suggestions
                if (confidence.improvements.length > 0) {
                    confidence.improvements.forEach(improvement => {
                        const li = document.createElement('li');
                        li.textContent = improvement;
                        improvementList.appendChild(li);
                    });
                } else {
                    improvementList.innerHTML = '<li>All measurements are within acceptable ranges.</li>';
                }
            } else {
                measurementAnalysis.classList.add('hidden');
            }
        }

        if (skuData.confidence) {
            let confidenceEl = this.resultContainer.querySelector('.confidence-info');
            
            const getConfidenceClass = (score) => {
                if (score >= 75) return 'bg-green-50 text-green-700';
                if (score >= 60) return 'bg-yellow-50 text-yellow-700';
                return 'bg-red-50 text-red-700';
            };

            const getConfidenceMessage = (score) => {
                if (score >= 75) return 'Very reliable fit';
                if (score >= 60) return 'Acceptable fit - please double-check measurements';
                return 'Please verify measurements carefully and consider consulting a specialist';
            };

            const confidenceColor = getConfidenceClass(skuData.confidence);
            const confidenceMessage = getConfidenceMessage(skuData.confidence);

            const confidenceHtml = `
                <div class="bg-white rounded-md p-4 shadow-sm confidence-info">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-500 inline-flex items-center cursor-help" id="confidence-score-label">
                                Fit Confidence
                                <svg class="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                </svg>
                            </span>
                            <span class="text-sm font-medium ${confidenceColor} px-2 py-1 rounded">
                                ${skuData.confidence}%
                            </span>
                        </div>
                        <div class="text-sm ${confidenceColor} mt-1">
                            ${confidenceMessage}
                        </div>
                    </div>
                </div>`;

            if (!confidenceEl) {
                const resultsDiv = this.resultContainer.querySelector('.space-y-3');
                if (resultsDiv) {
                    resultsDiv.insertAdjacentHTML('beforeend', confidenceHtml);
                }
            } else {
                confidenceEl.outerHTML = confidenceHtml;
            }

            // Initialize tooltip for confidence score explanation
            const confidenceLabel = document.getElementById('confidence-score-label');
            if (confidenceLabel) {
                tippy(confidenceLabel, {
                    content: `
                        <div class="p-2">
                            <p class="font-medium mb-2">Confidence Score Guide:</p>
                            <ul class="space-y-1">
                                <li>≥75%: Very reliable fit</li>
                                <li>60-74%: Acceptable fit, verify measurements</li>
                                <li><60%: Careful verification needed</li>
                            </ul>
                        </div>
                    `,
                    theme: 'custom',
                    allowHTML: true,
                    placement: 'right'
                });
            }
        }
    }
}

// Initialize the interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SKUInterface();
});