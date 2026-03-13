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
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn('price');
            $table->boolean('has_backlink_authority')->default(false);
            $table->decimal('price_authority_publisher', 12, 2)->nullable();
            $table->decimal('price_authority_advertiser', 12, 2)->nullable();
            $table->boolean('has_backlink_sidebar')->default(false);
            $table->decimal('price_sidebar', 12, 2)->nullable();
            $table->integer('sidebar_duration')->nullable();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('backlink_type', ['authority', 'sidebar'])->after('total')->default('authority');
            $table->string('article_source')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('backlink_type');
            $table->enum('article_source', ['publisher', 'advertiser'])->nullable(false)->change();
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn([
                'has_backlink_authority',
                'price_authority_publisher',
                'price_authority_advertiser',
                'has_backlink_sidebar',
                'price_sidebar',
                'sidebar_duration'
            ]);
            $table->decimal('price', 12, 2)->nullable();
        });
    }
};
