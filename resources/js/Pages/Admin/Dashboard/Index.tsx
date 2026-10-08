import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PackageSearch, Tags, ShoppingCart, DollarSign, TrendingUp, Bot } from 'lucide-react';
import FloatingChatWidget from "@/Components/FloatingChatWidget";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalCategories: number;
        todayTransactions: number;
        todayRevenue: number;
    };
    bestSellingProducts: {
        id: number;
        name: string;
        category: string;
        total_sold: number;
        revenue: number;
    }[];
    chartData: {
        name: string;
        revenue: number;
        transactions: number;
    }[];
    categorySales: {
        name: string;
        value: number;
    }[];
}

export default function Dashboard({ stats, bestSellingProducts, chartData, categorySales }: DashboardProps) {

    return (
        <AdminLayout title="Dashboard">
            <div className="flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Ringkasan performa bisnis dan penjualan wiliamCafe.</p>
                    </div>
                </div>

                {/* 4 Cards Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <PackageSearch className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Produk</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <Tags className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Kategori</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.totalCategories}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Transaksi Hari Ini</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.todayTransactions}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pendapatan Hari Ini</p>
                                <h3 className="text-2xl font-bold text-gray-900">Rp {stats.todayRevenue.toLocaleString('id-ID')}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2 Main Cards: Best Selling & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card: Best Selling Products */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                                5 Produk Terlaris
                            </h2>
                            <Link href={route('admin.menus.index')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                Lihat Semua
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3">Produk</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3 text-right">Terjual</th>
                                        <th className="px-4 py-3 text-right">Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bestSellingProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">{product.total_sold}</td>
                                            <td className="px-4 py-3 text-right text-green-600 font-medium">Rp {product.revenue.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {bestSellingProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                Belum ada data penjualan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Card: Monthly Sales Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-indigo-600" />
                                Grafik Penjualan Bulanan
                            </h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickFormatter={(value) => `Rp${value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <YAxis 
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any, name: any) => {
                                            if (name === 'Pendapatan') return [`Rp ${Number(value).toLocaleString('id-ID')}`, name];
                                            return [value, name];
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar yAxisId="left" dataKey="revenue" name="Pendapatan" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="transactions" name="Transaksi" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant untuk Admin */}
            <FloatingChatWidget />
        </AdminLayout>
    );
}
