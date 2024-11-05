<!DOCTYPE html>
<html lang="en" class="h-full bg-gradient-to-br from-blue-50 to-indigo-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stocking SKU Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    <!-- First load the lookup table -->
    <script src="./js/sizeLookup.js"></script>
    <!-- Then load the SKU generator -->
    <script src="./js/skuGenerator.js"></script>
    <!-- Finally load the main interface code -->
    <script src="./js/main.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .tippy-box[data-theme~='custom'] {
            background-color: #1f2937;
            color: white;
            border-radius: 8px;
            font-size: 18px;
            padding: 8px;
        }
        .tippy-box[data-theme~='custom'][data-placement^='top'] > .tippy-arrow::before {
            border-top-color: #1f2937;
        }
    </style>
</head>
<body class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                Stocking SKU Generator
            </h1>
            <p class="text-xl text-gray-600">
                Enter measurements to generate your unique stocking SKU
            </p>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <form id="sku-form" class="p-8">
                <!-- Product Options Section -->
                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Product Options</h2>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="form-group">
                            <label for="length" class="block text-[18px] font-medium text-gray-700 mb-2">Length</label>
                            <select name="length" id="length" 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]">
                                <option value="knee_length">Knee Length</option>
                                <option value="thigh_length">Thigh Length</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="color" class="block text-[18px] font-medium text-gray-700 mb-2">Color</label>
                            <select name="color" id="color" 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]">
                                <option value="bronze">Bronze</option>
                                <option value="black">Black</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="toe" class="block text-[18px] font-medium text-gray-700 mb-2">Toe Type</label>
                            <select name="toe" id="toe" 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="class" class="block text-[18px] font-medium text-gray-700 mb-2">Class</label>
                            <select name="class" id="class" 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]">
                                <option value="Class 1">Class 1</option>
                                <option value="Class 2">Class 2</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Measurements Section -->
                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Measurements</h2>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="form-group">
                            <label for="ankle" class="block text-[18px] font-medium text-gray-700 mb-2 inline-flex items-center">
                                Ankle Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" name="ankle" id="ankle" step="0.1" required 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]"
                                placeholder="Enter measurement">
                        </div>

                        <div class="form-group">
                            <label for="calf" class="block text-[18px] font-medium text-gray-700 mb-2 inline-flex items-center">
                                Calf Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" name="calf" id="calf" step="0.1" required 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]"
                                placeholder="Enter measurement">
                        </div>

                        <div class="form-group">
                            <label for="thigh" class="block text-[18px] font-medium text-gray-700 mb-2 inline-flex items-center">
                                Thigh Circumference (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" name="thigh" id="thigh" step="0.1" required 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]"
                                placeholder="Enter measurement">
                        </div>

                        <div class="form-group">
                            <label for="legLength" class="block text-[18px] font-medium text-gray-700 mb-2 inline-flex items-center">
                                Leg Length (cm)
                                <span class="ml-2 text-gray-400 info-icon cursor-help">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </label>
                            <input type="number" name="legLength" id="legLength" step="0.1" required 
                                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-[18px]"
                                placeholder="Enter measurement">
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center space-x-4">
                    <button type="button" id="generate-sku"
                        class="px-8 py-3 bg-blue-600 text-white text-[18px] font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        Check Size
                    </button>
                    <button type="button" id="copy-sku" disabled
                        class="px-8 py-3 bg-gray-400 text-white text-[18px] font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Copy SKU
                    </button>
                </div>
            </form>

            <!-- Results Section -->
            <div id="result" class="border-t border-gray-200 bg-gray-50 p-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-6">Results</h3>
                <div class="space-y-4">
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-[18px] font-medium text-gray-500">Stocking SKU</span>
                            <span id="sku-value" class="text-[18px] font-mono font-medium text-gray-900">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-[18px] font-medium text-gray-500">Your Size</span>
                            <span id="initial-size" class="text-[18px] font-medium text-gray-900">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-[18px] font-medium text-gray-500">Leg Length Type</span>
                            <span id="leg-length-type" class="text-[18px] font-medium text-gray-900">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <div class="flex flex-col">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-[18px] font-medium text-gray-500">Fit Confidence</span>
                                <span id="confidence-score" class="text-[18px] font-medium text-gray-900">-</span>
                            </div>
                            <p id="confidence-message" class="text-[18px] text-gray-600"></p>
                        </div>
                    </div>
                    <!-- Measurement Analysis Section -->
                    <div id="measurement-analysis" class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-[18px] font-medium text-gray-900 mb-2">Measurement Analysis</h4>
                        <div id="analysis-content" class="text-[18px] text-gray-600"></div>
                    </div>
                    <!-- Improvement Guidance Section -->
                    <div id="improvement-guidance" class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-[18px] font-medium text-gray-900 mb-2">Improvement Guidance</h4>
                        <div class="text-[18px] text-gray-600"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>