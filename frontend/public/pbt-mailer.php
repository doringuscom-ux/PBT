<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect data from POST
    $to = $_POST['to'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';
    
    if (empty($to) || empty($subject) || empty($message)) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: PB Tadka <noreply@pbtadka.com>' . "\r\n";

    // Send email using PHP mail() with -f flag (Required by Hostinger)
    if(mail($to, $subject, $message, $headers, "-f noreply@pbtadka.com")) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "PHP mail() function failed. Check server logs."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Only POST requests allowed"]);
}
?>
