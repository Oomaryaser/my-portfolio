<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // Add global middleware here
    ];

    protected $middlewareGroups = [
        'web' => [],
        'api' => [],
    ];
}
