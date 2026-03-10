<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Teknologi', 'slug' => 'teknologi'],
            ['name' => 'Bisnis & Ekonomi', 'slug' => 'bisnis-ekonomi'],
            ['name' => 'Kesehatan', 'slug' => 'kesehatan'],
            ['name' => 'Gaya Hidup', 'slug' => 'gaya-hidup'],
            ['name' => 'Pendidikan', 'slug' => 'pendidikan'],
            ['name' => 'Hiburan', 'slug' => 'hiburan'],
            ['name' => 'Otomotif', 'slug' => 'otomotif'],
            ['name' => 'Properti', 'slug' => 'properti'],
            ['name' => 'Wisata', 'slug' => 'wisata'],
            ['name' => 'Kuliner', 'slug' => 'kuliner'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
