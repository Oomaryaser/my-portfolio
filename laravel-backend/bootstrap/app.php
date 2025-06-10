<?php

use Illuminate\Foundation\Application;

$app = new Application(
    __DIR__.'/..'
);

$app->usePublicPath(__DIR__.'/../public');

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

return $app;
