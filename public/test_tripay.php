<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$merchantCode = 'T17133';
$privateKey = 'yn3Xq6-ACznD-HVKCw-UDheP-fDIFf';
$apiKey = 'DEV-Mw0X24wAGYwvEWoM83Mpm0OQPtLHa1PY3N6S72CI';

$merchantRef = 'INV-' . strtoupper(uniqid());
$amount = 350000;

$signature = hash_hmac('sha256', $merchantCode . $merchantRef . $amount, $privateKey);

$payload = [
    'method' => 'BRIVA', // Try a specific method instead of generic QRIS which could be invalid for sandbox
    'merchant_ref' => $merchantRef,
    'amount' => $amount,
    'customer_name' => 'Test Name',
    'customer_email' => 'test@example.com',
    'customer_phone' => '081234567890',
    'order_items' => [
        [
            'name' => 'Item 1',
            'price' => $amount,
            'quantity' => 1,
        ]
    ],
    'return_url' => 'https://domain.com/redirect',
    'expired_time' => (time() + (24 * 60 * 60)), // 24 hours
    'signature' => $signature
];

$ch = curl_init();

// Use json encoded body instead of http_build_query
$jsonPayload = json_encode($payload);

curl_setopt_array($ch, [
    CURLOPT_URL => 'https://tripay.co.id/api-sandbox/transaction/create',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => false,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ],
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $jsonPayload
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo "cURL Error #:" . $err;
}
else {
    echo $response;
}
