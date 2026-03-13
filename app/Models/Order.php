<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'blog_id', 'invoice_id', 'total', 'quantity', 
        'admin_fee', 'publisher_amount', 'admin_fee_percentage',
        'backlink_type', 'article_source', 'description',
        'instructions', 'doc_link', 'notes', 'status', 'published_link', 'published_links',
        'tripay_reference', 'tripay_checkout_url'
    ];

    protected $casts = [
        'published_links' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // Advertiser
    }

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function links()
    {
        return $this->hasMany(OrderLink::class);
    }
}
