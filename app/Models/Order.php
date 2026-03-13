<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'blog_id', 'invoice_id', 'total', 'backlink_type', 'article_source',
        'instructions', 'doc_link', 'notes', 'status', 'published_link',
        'tripay_reference', 'tripay_checkout_url'
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
