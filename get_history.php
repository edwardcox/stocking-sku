<?php
session_start();

// Check authentication
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$backupDir = 'backups';
$history = [];

// Create backup directory if it doesn't exist
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0777, true);
}

// Get backup files
$files = glob($backupDir . '/sizeLookup_*.js');
if ($files) {
    foreach ($files as $file) {
        $timestamp = filemtime($file);
        $size = filesize($file);
        $filename = basename($file);
        
        // Get changes from log file for this backup if available
        $logFile = $backupDir . '/changes.log';
        $logEntry = '';
        if (file_exists($logFile)) {
            $date = date('Y-m-d H:i:s', $timestamp);
            $log = file_get_contents($logFile);
            if (preg_match("/^$date.*$/m", $log, $matches)) {
                $logEntry = $matches[0];
            }
        }

        $history[] = [
            'filename' => $filename,
            'date' => date('Y-m-d H:i:s', $timestamp),
            'size' => formatBytes($size),
            'log' => $logEntry,
            'path' => $file
        ];
    }
}

// Sort by timestamp descending (newest first)
usort($history, function($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

header('Content-Type: application/json');
echo json_encode(['success' => true, 'history' => $history]);

function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}