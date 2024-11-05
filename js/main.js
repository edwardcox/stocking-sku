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

        // Safely add tooltips
        for (const [id, content] of Object.entries(measurementTooltips)) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) {
                const icon = label.querySelector('.info-icon');
                if (icon) {
                    tippy(icon, {
                        content: content,
                        theme: 'custom',
                        placement: 'right'
                    });
                }
            }
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

        try {
            const getInputValue = (id) => {
                const input = this.form.querySelector('#' + id);
                if (!input) {
                    throw new Error(`Input field #${id} not found`);
                }
                return input.value;
            };

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

    updateResults(skuData) {
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

        // Update confidence information
        const confidenceScore = document.querySelector('#confidence-score');
        const confidenceMessage = document.querySelector('#confidence-message');
        const analysisContent = document.querySelector('#analysis-content');
        const improvementGuidance = document.querySelector('#improvement-guidance div');

        if (confidenceScore) {
            confidenceScore.textContent = `${skuData.confidence || 0}%`;
        }

        if (confidenceMessage) {
            confidenceMessage.textContent = skuData.message || '';
            if (skuData.confidence >= 75) {
                confidenceMessage.className = 'text-[18px] text-green-600';
            } else if (skuData.confidence >= 60) {
                confidenceMessage.className = 'text-[18px] text-yellow-600';
            } else {
                confidenceMessage.className = 'text-[18px] text-red-600';
            }
        }

        // Update measurement analysis
        if (analysisContent && skuData.analysis) {
            analysisContent.innerHTML = skuData.analysis.split('\n').map(line => 
                line ? `<p>${line}</p>` : ''
            ).join('');
        }

        // Update improvement guidance
        if (improvementGuidance) {
            if (skuData.improvements && skuData.improvements.length > 0) {
                const list = document.createElement('ul');
                list.className = 'list-disc pl-5 space-y-1';
                skuData.improvements.forEach(improvement => {
                    const li = document.createElement('li');
                    li.textContent = improvement;
                    list.appendChild(li);
                });
                improvementGuidance.innerHTML = '';
                improvementGuidance.appendChild(list);
            } else {
                improvementGuidance.textContent = 'All measurements are within acceptable ranges.';
            }
        }
    }

    attachEventListeners() {
        if (this.generateSKUButton) {
            this.generateSKUButton.addEventListener('click', () => {
                try {
                    const formData = this.getFormData();
                    if (!formData) {
                        throw new Error('Unable to get form data');
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

                    this.updateResults(skuData);
                    this.updateCopyButtonStyle(true);
                } catch (error) {
                    console.error('Error:', error);
                    alert(error.message);
                }
            });
        }

        if (this.copySKUButton) {
            this.copySKUButton.addEventListener('click', () => {
                const skuValue = this.resultContainer.querySelector('#sku-value')?.textContent;
                if (skuValue && skuValue !== '-') {
                    navigator.clipboard.writeText(skuValue)
                        .then(() => {
                            alert('SKU copied to clipboard!');
                        })
                        .catch(err => {
                            console.error('Could not copy SKU: ', err);
                            alert('Failed to copy SKU. Please copy it manually.');
                        });
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SKUInterface();
});