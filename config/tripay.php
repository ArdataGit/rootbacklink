<?php

return [
    'api_key' => env('TRIPAY_API_KEY', ''),
    'private_key' => env('TRIPAY_PRIVATE_KEY', ''),
    'merchant_code' => env('TRIPAY_MERCHANT_CODE', ''),
    'mode' => env('TRIPAY_MODE', 'sandbox'), // 'sandbox' or 'production'

    'sandbox_url' => 'https://tripay.co.id/api-sandbox',
    'production_url' => 'https://tripay.co.id/api',
];
