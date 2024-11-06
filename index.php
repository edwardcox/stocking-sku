<?php
// Any PHP initialization code can go here
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scintera - Stocking SKU Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    <script src="./js/sizeLookup.js"></script>
    <script src="./js/skuGenerator.js"></script>
    <script src="./js/main.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
    @font-face {
        font-family: 'PIRULEN';
        src: url('fonts/pirulen-rg.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    .scintera-logo {
        font-family: 'PIRULEN', sans-serif;
        color: #29ABE2;
        text-decoration: none;
        display: block;
        text-align: center;
    }

    .scintera-title {
        font-size: 4rem; /* 64px */
        line-height: 1;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
    }

    .scintera-tagline {
        font-family: 'Inter', sans-serif;
        font-size: 1.25rem; /* 20px */
        letter-spacing: 0.05em;
        font-weight: 400;
    }
</style>
</head>
<body class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
        
        <!-- Header with Logo -->
        <div class="text-center mb-12">
            <!-- Logo Container -->
            <div class="mb-8">
                <img src="images/scintera-logo.webp" 
                     alt="Scintera - Reduce Scars, Reveal Confidence" 
                     class="w-full max-w-md mx-auto h-auto"
                />
            </div>
            
            <!-- Tool Title -->
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Stocking SKU Generator
            </h2>
            <p class="text-lg text-gray-600 mb-8">
                Enter measurements to generate your unique stocking SKU
            </p>
        </div>
        <!-- Main Card -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <form id="sku-form" class="p-6">
                <!-- Product Options Section -->
                <div class="mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-6">Product Options</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label for="length" class="block text-base font-medium text-gray-700 mb-2">Length</label>
                            <select name="length" id="length" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="knee_length">Knee Length</option>
                                <option value="thigh_length">Thigh Length</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="color" class="block text-base font-medium text-gray-700 mb-2">Color</label>
                            <select name="color" id="color" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="bronze">Bronze</option>
                                <option value="black">Black</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="toe" class="block text-base font-medium text-gray-700 mb-2">Toe Type</label>
                            <select name="toe" id="toe" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="class" class="block text-base font-medium text-gray-700 mb-2">Class</label>
                            <select name="class" id="class" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="Class 1">Class 1</option>
                                <option value="Class 2">Class 2</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Measurements Section -->
                <div class="mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-6">Measurements</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                        <label for="ankle" class="inline-flex items-center text-base font-medium text-gray-700 mb-2">
                                Ankle Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" 
                                   name="ankle" 
                                   id="ankle" 
                                   step="0.1" 
                                   required 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   placeholder="Enter measurement">
                        </div>
                        <div class="form-group">
                        <label for="calf" class="inline-flex items-center text-base font-medium text-gray-700 mb-2">
                                Calf Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" 
                                   name="calf" 
                                   id="calf" 
                                   step="0.1" 
                                   required 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   placeholder="Enter measurement">
                        </div>

                        <div class="form-group">
                        <label for="thigh" class="inline-flex items-center text-base font-medium text-gray-700 mb-2">
                                Thigh Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" 
                                   name="thigh" 
                                   id="thigh" 
                                   step="0.1" 
                                   required 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   placeholder="Enter measurement">
                        </div>

                        <div class="form-group">
                        <label for="legLength" id="lengthLabel" class="inline-flex items-center text-base font-medium text-gray-700 mb-2">
                            Leg Length (cm) 
                            <span class="ml-2 text-gray-400 info-icon cursor-help">
                            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                            </span>
                        </label>
                            <input type="number" 
                                   name="legLength" 
                                   id="legLength" 
                                   step="0.1" 
                                   required 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   placeholder="Enter measurement">
                        </div>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex justify-center space-x-4 mb-6">
                    <button type="button" 
                            id="generate-sku"
                            class="px-6 py-2 bg-[#29ABE2] text-white font-medium rounded-md hover:bg-[#1a8dbd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29ABE2] transition-colors duration-200">
                        Check Size
                    </button>
                    <button type="button" 
                            id="copy-sku" 
                            disabled
                            class="px-6 py-2 bg-gray-300 text-white font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Copy SKU
                    </button>
                </div>
            </form>

            <!-- Results Section -->
            <div id="result" class="border-t border-gray-200 bg-gray-50">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Results</h3>
                    
                    <!-- Results Grid -->
                    <div class="space-y-3">
                        <!-- SKU Result -->
                        <div class="bg-white rounded-md p-4 shadow-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-500">Stocking SKU</span>
                                <span id="sku-value" class="text-base font-mono font-medium text-gray-900">-</span>
                            </div>
                        </div>

                        <!-- Size Result -->
                        <div class="bg-white rounded-md p-4 shadow-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-500">Your Size</span>
                                <span id="initial-size" class="text-base font-medium text-gray-900">-</span>
                            </div>
                        </div>

                        <!-- Length Type Result -->
                        <div class="bg-white rounded-md p-4 shadow-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-500">Leg Length Type</span>
                                <span id="leg-length-type" class="text-base font-medium text-gray-900">-</span>
                            </div>
                        </div>

                        <!-- Confidence Score -->
                        <div class="bg-white rounded-md p-4 shadow-sm">
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-500">Fit Confidence</span>
                                    <span id="confidence-score" class="text-base font-medium text-gray-900">-</span>
                                </div>
                                <p id="confidence-message" class="text-sm text-gray-600"></p>
                            </div>
                        </div>
                        <!-- Measurement Analysis -->
                        <div id="measurement-analysis" class="bg-white rounded-md p-4 shadow-sm">
                            <h4 class="text-sm font-medium text-gray-900 mb-2">Measurement Analysis</h4>
                            <div id="analysis-content" class="text-sm text-gray-600 space-y-1"></div>
                        </div>

                        <!-- Improvement Guidance -->
                        <div id="improvement-guidance" class="bg-white rounded-md p-4 shadow-sm">
                            <h4 class="text-sm font-medium text-gray-900 mb-2">Improvement Guidance</h4>
                            <div class="text-sm text-gray-600 space-y-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-8 text-center">
            <div class="flex flex-col items-center justify-center space-y-2">
                <img src="images/scintera-logo.webp" 
                     alt="Scintera" 
                     class="h-8 w-auto"
                />
                <p class="text-sm text-gray-500">
                    &copy; <?php echo date('Y'); ?> Scintera. All rights reserved.
                </p>
            </div>
        </footer>
    </div>

    <!-- Tooltips Content -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const tooltipContent = {
                ankle: "Measure around the narrowest part of the ankle",
                calf: "Measure around the widest part of the calf muscle",
                thigh: "Measure around the widest part of the thigh",
                legLength: "For knee length: Measure from floor to bend of knee\nFor thigh length: Measure from floor to gluteal fold"
            };

            // Initialize tooltips for measurement fields
            Object.keys(tooltipContent).forEach(id => {
                const element = document.querySelector(`label[for="${id}"] .info-icon`);
                if (element) {
                    tippy(element, {
                        content: tooltipContent[id],
                        theme: 'custom',
                        placement: 'right'
                    });
                }
            });
        });
    </script>
</body>
</html>
