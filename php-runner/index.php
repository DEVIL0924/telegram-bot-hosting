<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$bot_token = $input['bot_token'] ?? '';
$bot_code = $input['bot_code'] ?? '';

// Create bot directory
$bot_dir = "bots/{$bot_token}";
if (!is_dir($bot_dir)) {
    mkdir($bot_dir, 0777, true);
}

// Save bot code
file_put_contents("{$bot_dir}/bot.php", $bot_code);

// Execute bot
exec("php {$bot_dir}/bot.php > {$bot_dir}/output.log 2>&1 &");

echo json_encode([
    'status' => 'success',
    'message' => 'PHP bot started'
]);
?>
