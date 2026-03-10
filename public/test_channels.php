<?php

$apiKey = 'DEV-Mw0X24wAGYwvEWoM83Mpm0OQPtLHa1PY3N6S72CI';

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://tripay.co.id/api-sandbox/merchant/payment-channel',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => false,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey
    ],
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
