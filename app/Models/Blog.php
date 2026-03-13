<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'domain', 'da', 'pa', 'ss',
        'indexing', 'traffic', 'status',
        'has_backlink_authority', 'price_authority_publisher', 'price_authority_advertiser',
        'has_backlink_sidebar', 'price_sidebar', 'sidebar_duration'
    ];

    protected $casts = [
        'has_backlink_authority' => 'boolean',
        'has_backlink_sidebar' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
