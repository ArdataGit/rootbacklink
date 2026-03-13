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
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('total');
            $table->decimal('admin_fee', 12, 2)->default(0)->after('quantity');
            $table->decimal('publisher_amount', 12, 2)->default(0)->after('admin_fee');
            $table->decimal('admin_fee_percentage', 5, 2)->default(0)->after('publisher_amount');
            $table->json('published_links')->nullable()->after('published_link');
            $table->text('description')->nullable()->after('article_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'quantity',
                'admin_fee',
                'publisher_amount',
                'admin_fee_percentage',
                'published_links',
                'description'
            ]);
        });
    }
};
