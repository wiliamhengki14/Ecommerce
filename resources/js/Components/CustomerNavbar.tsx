import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Search, Menu, User, ClipboardList, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ApplicationLogo from './ApplicationLogo';
import Modal from './Modal';
import Button from './ui/Button/Button';

export default function CustomerNavbar() {
    const { auth, cart_count, order_count } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const initialSearch = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') || '' : '';
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [showLogout, setShowLogout] = useState(false);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('menus.index'),
                { search: searchQuery },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('menus.index'), { search: searchQuery }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            preserveScroll: true,
        })
    }

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-5">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex items-center shrink-0">
                        <Link href="/" className="flex items-center gap-3">
                            {/* <ApplicationLogo className="block h-10 w-auto fill-current text-indigo-600" /> */}
                            <span className="font-extrabold text-2xl tracking-tight text-gray-900 hidden sm:block">
                                Wiliam<span className="text-indigo-600">Jaya</span>
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#1c1c1c] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-inner"
                                placeholder="Cari produk, kategori, atau merek..."
                            />
                            <button type="submit" className="absolute inset-y-1.5 right-1.5 px-4 bg-[#1c1c1c] hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-colors">
                                Cari
                            </button>   
                        </form>
                    </div>

                    {/* Right Navigation */}
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        {/* Cart */}
                        <Link href="/carts" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {cart_count > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full shadow-sm">
                                    {cart_count}
                                </span>
                            )}
                        </Link>
                        <Link href="/orders" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <ClipboardList className="h-6 w-6" />
                            {order_count > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full shadow-sm">
                                    {order_count}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        <div className="hidden sm:flex items-center space-x-4 border-l border-gray-200 pl-6">
                            {auth?.user ? (
                                <div className='flex items-center gap-3'>
                                    <Link href={route('menus.index')} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors group">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold group-hover:bg-indigo-100 transition-colors">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="max-w-[120px] truncate">{auth.user.name}</span>
                                        
                                    </Link>
                                    <LogOut onClick={() => setShowLogout(true)} className='text-red-600'/>
                                </div>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-2">
                                        Masuk
                                    </Link>
                                    <Link href={route('register')} className="text-sm font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                        <Modal show={showLogout} onClose={() => setShowLogout(false)} maxWidth='sm'>
                            <div className='p-6'>
                                <div>
                                    <h2 className='font-extrabold text-red-800 text-2xl mb-2'>Konfirmasi Logout</h2>
                                </div>
                                <p className='text-[#1c1c1c]'>Apakah anda ingin logout?</p>
                                <div className='flex justify-end gap-2 mt-4'>
                                    <Button color='sekunder' onClick={() => setShowLogout(false)}>Batal</Button>
                                    <Button className='bg-red-500 text-white' onClick={handleLogout}>Ya, Logout</Button>
                                </div>
                            </div>
                        </Modal>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'}`}>
                <div className="bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                            placeholder="Cari produk..."
                        />
                    </form>
                    
                    {!auth?.user ? (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link href={route('login')} className="w-full flex justify-center py-2.5 px-4 border border-indigo-600 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-colors">
                                Daftar
                            </Link>
                        </div>
                    ) : (
                        <div className="pt-2">
                             <Link href={route('menus.index')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{auth.user.name}</span>
                                    <span className="text-xs text-gray-500">Lihat Dashboard</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
