<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart_count' => fn () => $request->user()
                ? Cart::where('user_id', $request->user()->id)->count()
                : 0,

            'order_count' => fn () => $request->user()
                ? Order::where('status', 'pending')
                    ->where('user_id', $request->user()->id)
                    ->count()
                : 0,
            'order_count_admin' => fn () => $request->user()
                ? Order::where('status', 'pending')
                    ->count()
                : 0,
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
        ];
    }
}
