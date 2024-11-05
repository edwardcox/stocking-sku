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
    <!-- Rest of your head content -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .form-label {
            font-size: 18px !important;
            font-weight: 500 !important;
            color: #374151 !important;
        }
        .form-input, .form-select {
            font-size: 18px !important;
            height: 50px !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            border-color: #E5E7EB !important;
            background-color: white !important;
        }
        .form-input::placeholder {
            color: #9CA3AF !important;
            font-size: 18px !important;
        }
        .section-title {
            font-size: 24px !important;
            font-weight: 600 !important;
            color: #111827 !important;
            margin-bottom: 1.5rem !important;
        }
        .result-label {
            font-size: 18px !important;
            color: #6B7280 !important;
        }
        .result-value {
            font-size: 18px !important;
            color: #111827 !important;
        }
        .tippy-box[data-theme~='custom'] {
            font-size: 16px !important;
            padding: 8px 12px;
        }
    </style>
</head>
<body class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
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
                <h2 class="section-title">Product Options</h2>
                <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                    <div class="form-group">
                        <label for="length" class="form-label block mb-2">Length</label>
                        <select name="length" id="length" class="form-select block w-full">
                            <option value="knee_length">Knee Length</option>
                            <option value="thigh_length">Thigh Length</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="color" class="form-label block mb-2">Color</label>
                        <select name="color" id="color" class="form-select block w-full">
                            <option value="bronze">Bronze</option>
                            <option value="black">Black</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="toe" class="form-label block mb-2">Toe Type</label>
                        <select name="toe" id="toe" class="form-select block w-full">
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="class" class="form-label block mb-2">Class</label>
                        <select name="class" id="class" class="form-select block w-full">
                            <option value="Class 1">Class 1</option>
                            <option value="Class 2">Class 2</option>
                        </select>
                    </div>
                </div>

                <!-- Measurements Section -->
                <h2 class="section-title">Measurements</h2>
                <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                    <div class="form-group">
                        <label for="ankle" class="form-label block mb-2 inline-flex items-center">
                            Ankle Circumference (cm)
                            <span class="ml-2 text-gray-400">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 7.5a.5.5 0 11-1 0 .5.5 0 011 0z"/>
                                    <path d="M10.5 10a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"/>
                                </svg>
                            </span>
                        </label>
                        <input type="number" name="ankle" id="ankle" step="0.1" required
                            class="form-input block w-full"
                            placeholder="Enter measurement">
                    </div>

                    <div class="form-group">
                        <label for="calf" class="form-label block mb-2 inline-flex items-center">
                            Calf Circumference (cm)
                            <span class="ml-2 text-gray-400">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 7.5a.5.5 0 11-1 0 .5.5 0 011 0z"/>
                                    <path d="M10.5 10a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"/>
                                </svg>
                            </span>
                        </label>
                        <input type="number" name="calf" id="calf" step="0.1" required
                            class="form-input block w-full"
                            placeholder="Enter measurement">
                    </div>

                    <div class="form-group">
                        <label for="thigh" class="form-label block mb-2 inline-flex items-center">
                            Thigh Circumference (cm)
                            <span class="ml-2 text-gray-400">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 7.5a.5.5 0 11-1 0 .5.5 0 011 0z"/>
                                    <path d="M10.5 10a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"/>
                                </svg>
                            </span>
                        </label>
                        <input type="number" name="thigh" id="thigh" step="0.1" required
                            class="form-input block w-full"
                            placeholder="Enter measurement">
                    </div>

                    <div class="form-group">
                        <label for="legLength" class="form-label block mb-2 inline-flex items-center">
                            Leg Length (cm)
                            <span class="ml-2 text-gray-400">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 7.5a.5.5 0 11-1 0 .5.5 0 011 0z"/>
                                    <path d="M10.5 10a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"/>
                                </svg>
                            </span>
                        </label>
                        <input type="number" name="legLength" id="legLength" step="0.1" required
                            class="form-input block w-full"
                            placeholder="Enter measurement">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center space-x-4">
                    <button type="button" id="generate-sku"
                        class="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        Check Size
                    </button>
                    <button type="button" id="copy-sku" disabled
                        class="px-8 py-3 bg-gray-400 text-white text-lg font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Copy SKU
                    </button>
                </div>
            </form>

            <!-- Results Section -->
            <div id="result" class="border-t border-gray-200 bg-gray-50 p-8">
                <h3 class="section-title mb-4">Results</h3>
                <div class="space-y-4">
                    <div class="bg-white rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <span class="result-label">Stocking SKU</span>
                            <span id="sku-value" class="result-value font-mono">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <span class="result-label">Your Size</span>
                            <span id="initial-size" class="result-value">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <span class="result-label">Leg Length Type</span>
                            <span id="leg-length-type" class="result-value">-</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="result-label">Fit Confidence</span>
                                <span id="confidence-score" class="result-value">-</span>
                            </div>
                            <p id="confidence-message" class="text-sm mt-2">-</p>
                            
                            <!-- Measurement Analysis -->
                            <div id="measurement-analysis" class="mt-4 space-y-4 hidden">
                                <h4 class="font-medium text-gray-700">Measurement Analysis</h4>
                                <div id="deviation-breakdown" class="space-y-2">
                                    <!-- Deviation bars will be inserted here -->
                                </div>
                                
                                <!-- Improvement Guidance -->
                                <div id="improvement-guidance" class="mt-4">
                                    <h4 class="font-medium text-gray-700">Improvement Guidance</h4>
                                    <ul id="improvement-list" class="list-disc list-inside text-sm text-gray-600 mt-2">
                                        <!-- Improvement suggestions will be inserted here -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>