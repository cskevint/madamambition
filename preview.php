<?php
// Use Parsedown to convert Markdown to HTML
require_once __DIR__ . '/vendor/autoload.php';

// Get the 'article' parameter from the URL
$article = isset($_GET['article']) ? $_GET['article'] : '';
if (!$article) {
    echo "<h2>No article specified.</h2>";
    exit;
}

$file_path = __DIR__ . '/articles/' . basename($article) . '.md';
if (!file_exists($file_path)) {
    echo "<h2>Article not found.</h2>";
    exit;
}

$markdown = file_get_contents($file_path);
$Parsedown = new Parsedown();
$html = $Parsedown->text($markdown);

echo $html;
?>
