<?php
session_start();

// Check authentication
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['data'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid data format']);
    exit;
}

// Ensure backup directory exists
$backupDir = 'backups';
if (!file_exists($backupDir)) {
    if (!mkdir($backupDir, 0777, true)) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Failed to create backup directory']);
        exit;
    }
}

// Check if backup directory is writable
if (!is_writable($backupDir)) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Backup directory is not writable']);
    exit;
}

// Create backup with error checking
$backupFile = $backupDir . '/sizeLookup_' . date('Y-m-d_H-i-s') . '.js';
if (!file_exists('js/sizeLookup.js')) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Source file does not exist']);
    exit;
}

if (!copy('js/sizeLookup.js', $backupFile)) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to create backup: ' . error_get_last()['message']
    ]);
    exit;
}

// Format the new JavaScript file content
$jsContent = "// sizeLookup.js\nconst sizeLookupTable = " . json_encode($data['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";

// Write the new file with error checking
if (!is_writable('js/sizeLookup.js')) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Source file is not writable']);
    exit;
}

if (file_put_contents('js/sizeLookup.js', $jsContent) === false) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to save changes: ' . error_get_last()['message']
    ]);
    exit;
}

// Log the change
$logFile = $backupDir . '/changes.log';
$logEntry = date('Y-m-d H:i:s') . " - Table updated\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

header('Content-Type: application/json');
echo json_encode(['success' => true]);