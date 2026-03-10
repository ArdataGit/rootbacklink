<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected string $apiKey;
    protected string $privateKey;
    protected string $merchantCode;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = trim(config('tripay.api_key', ''));
        $this->privateKey = trim(config('tripay.private_key', ''));
        $this->merchantCode = trim(config('tripay.merchant_code', ''));
        $this->baseUrl = config('tripay.mode') === 'production'
            ? config('tripay.production_url')
            : config('tripay.sandbox_url');
    }

    /**
     * Create a closed transaction on Tripay.
     */
    public function createTransaction(array $params): array
    {
        $merchantRef = $params['merchant_ref'];
        $amount = (int)$params['amount'];

        $signatureString = $this->merchantCode . $merchantRef . $amount;
        $signature = hash_hmac('sha256', $signatureString, $this->privateKey);

        Log::info('Tripay signature debug', [
            'merchant_code' => $this->merchantCode,
            'merchant_ref' => $merchantRef,
            'amount' => $amount,
            'signature_string' => $signatureString,
        ]);

        $payload = [
            'method' => $params['method'] ?? 'QRIS',
            'merchant_ref' => $merchantRef,
            'amount' => $amount,
            'customer_name' => $params['customer_name'],
            'customer_email' => $params['customer_email'],
            'customer_phone' => $params['customer_phone'] ?? '',
            'order_items' => $params['order_items'],
            'callback_url' => route('tripay.callback'),
            'return_url' => $params['return_url'] ?? route('advertiser.transaksi'),
            'expired_time' => (int)(now()->addDay()->timestamp),
            'signature' => $signature,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post($this->baseUrl . '/transaction/create', $payload);

            $body = $response->json();

            if ($response->successful() && isset($body['success']) && $body['success']) {
                return [
                    'success' => true,
                    'data' => $body['data'],
                ];
            }

            Log::error('Tripay create transaction failed', ['response' => $body]);
            return [
                'success' => false,
                'message' => $body['message'] ?? 'Failed to create Tripay transaction.',
            ];
        }
        catch (\Exception $e) {
            Log::error('Tripay create transaction exception', ['error' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Tripay service unavailable: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Verify the callback signature from Tripay.
     */
    public function verifyCallbackSignature(string $jsonBody): bool
    {
        $signature = hash_hmac('sha256', $jsonBody, $this->privateKey);
        $callbackSignature = request()->server('HTTP_X_CALLBACK_SIGNATURE') ?? '';

        return hash_equals($signature, $callbackSignature);
    }

    /**
     * Get available payment channels.
     */
    public function getPaymentChannels(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/merchant/payment-channel');

            $body = $response->json();

            if ($response->successful() && isset($body['success']) && $body['success']) {
                return $body['data'] ?? [];
            }

            return [];
        }
        catch (\Exception $e) {
            Log::error('Tripay get channels error', ['error' => $e->getMessage()]);
            return [];
        }
    }
}
