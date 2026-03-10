<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Advertiser
            $table->foreignId('blog_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_id')->unique();
            $table->decimal('total', 12, 2);
            $table->enum('article_source', ['publisher', 'advertiser']);
            $table->text('instructions')->nullable();
            $table->string('doc_link')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['unpaid', 'paid', 'published', 'completed'])->default('unpaid');
            $table->string('published_link')->nullable();
            $table->string('tripay_reference')->nullable();
            $table->string('tripay_checkout_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
