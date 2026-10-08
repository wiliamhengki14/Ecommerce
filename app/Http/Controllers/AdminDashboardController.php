<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Stats
        $totalProducts = Menu::count();
        $totalCategories = Menu::distinct('kategori')->count('kategori');
        $todayTransactions = Order::whereDate('created_at', Carbon::today())->where('status', 'completed')->count();
        $todayRevenue = Order::whereDate('created_at', Carbon::today())
            ->where('status', 'completed')
            ->sum('total_amount');

        // 2. Best Selling Products (Limit 5)
        $bestSellingProducts = OrderItem::with('menu')
            ->select('menu_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(price * quantity) as total_revenue'))
            ->groupBy('menu_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->menu_id,
                    'name' => $item->menu ? $item->menu->name : 'Unknown',
                    'category' => $item->menu ? $item->menu->kategori : '-',
                    'total_sold' => (int) $item->total_sold,
                    'revenue' => (int) $item->total_revenue,
                ];
            });

        // 3. Monthly Sales Chart (Current Year)
        $monthlySales = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(total_amount) as revenue'),
            DB::raw('COUNT(id) as transactions')
        )
            ->whereYear('created_at', Carbon::now()->year)
            ->where('status', 'completed')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Format for recharts
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $chartData = collect(range(1, 12))->map(function ($month) use ($monthlySales, $months) {
            $data = $monthlySales->firstWhere('month', $month);

            return [
                'name' => $months[$month - 1],
                'revenue' => $data ? (int) $data->revenue : 0,
                'transactions' => $data ? (int) $data->transactions : 0,
            ];
        });

        // Optional: Sales per category chart data
        $categorySales = OrderItem::join('menus', 'item_orders.menu_id', '=', 'menus.id')
            ->join('orders', 'item_orders.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->select('menus.kategori', DB::raw('SUM(item_orders.quantity) as items_sold'))
            ->groupBy('menus.kategori')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->kategori,
                    'value' => (int) $item->items_sold,
                ];
            });

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'todayTransactions' => $todayTransactions,
                'todayRevenue' => (int) $todayRevenue,
            ],
            'bestSellingProducts' => $bestSellingProducts,
            'chartData' => $chartData,
            'categorySales' => $categorySales,
        ]);
    }
}
