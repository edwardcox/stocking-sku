<?php
session_start();

// Configuration
define('USERNAME', 'admin');  // Change this to your desired username
define('PASSWORD_HASH', password_hash('admin123', PASSWORD_DEFAULT));  // Change 'admin123' to your desired password
define('BACKUP_DIR', 'backups/');
define('SIZE_LOOKUP_FILE', 'js/sizeLookup.js');

// Authentication check
function isAuthenticated() {
    return isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    if ($_POST['username'] === USERNAME && 
        password_verify($_POST['password'], PASSWORD_HASH)) {
        $_SESSION['authenticated'] = true;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    } else {
        $error = 'Invalid credentials';
    }
}

// Handle logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Create backup directory if it doesn't exist
if (!file_exists(BACKUP_DIR)) {
    mkdir(BACKUP_DIR, 0777, true);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Size Table Maintenance - Scintera</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @font-face {
            font-family: 'PIRULEN';
            src: url('fonts/PIRULEN.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        .scintera-title {
            font-family: 'PIRULEN', sans-serif;
            color: #29ABE2;
        }
    </style>
</head>
<body class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <h1 class="scintera-title text-3xl">SCINTERA</h1>
                <?php if (isAuthenticated()): ?>
                    <a href="?action=logout" class="text-gray-600 hover:text-gray-900">Logout</a>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <?php if (!isAuthenticated()): ?>
            <!-- Login Form -->
            <div class="max-w-md mx-auto mt-10">
                <div class="bg-white py-8 px-6 shadow rounded-lg">
                    <h2 class="text-2xl font-bold mb-8 text-center text-gray-900">Size Table Maintenance</h2>
                    <?php if (isset($error)): ?>
                        <div class="bg-red-50 text-red-700 p-3 rounded mb-4">
                            <?php echo htmlspecialchars($error); ?>
                        </div>
                    <?php endif; ?>
                    <form method="POST" class="space-y-6">
                        <input type="hidden" name="action" value="login">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" name="username" id="username" required 
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" id="password" required 
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <button type="submit" 
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        <?php else: ?>
            <!-- Size Table Editor -->
            <div id="sizeTableEditor" class="bg-white shadow rounded-lg p-6">
                <!-- Tab Navigation -->
                <div class="border-b border-gray-200 mb-6">
                    <nav class="-mb-px flex space-x-8">
                        <button class="tab-btn active border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-table="thigh_length">
                            Thigh Length
                        </button>
                        <button class="tab-btn text-gray-500 hover:text-gray-700 whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm" data-table="knee_length">
                            Knee Length
                        </button>
                    </nav>
                </div>

                <!-- Length Type Selection -->
                <div class="mb-6">
                    <select id="lengthType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                        <option value="Normal">Normal Length</option>
                        <option value="Petite">Petite Length</option>
                    </select>
                </div>

                <!-- Size Table -->
                <div class="overflow-x-auto">
                    <table id="sizeTable" class="min-w-full divide-y divide-gray-200">
                        <!-- Table content will be dynamically populated -->
                    </table>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-between items-center">
                    <button id="viewHistory" 
                            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Backup History
                    </button>
                    <div class="flex space-x-3">
                        <button id="saveChanges" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Save Changes
                        </button>
                        <button id="cancelChanges" class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Backup History Modal -->
            <div id="historyModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 hidden" style="z-index: 1000;">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                        <!-- Modal Header -->
                        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900">Backup History</h3>
                            <button id="closeHistory" class="text-gray-400 hover:text-gray-500">
                                <span class="sr-only">Close</span>
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Modal Content -->
                        <div class="px-6 py-4 flex-1 overflow-auto">
                            <div id="historyContent" class="space-y-4">
                                <!-- Content will be populated by JavaScript -->
                            </div>
                        </div>
                        
                        <!-- Modal Footer -->
                        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button id="closeHistoryButton" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </main>

    <?php if (isAuthenticated()): ?>
    <script src="js/maintenance.js"></script>
    <?php endif; ?>
</body>
</html>