import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function InventoryDashboard() {
    const inventoryItems = [
        {
            name: 'MacBook Air M2',
            serial: 'MBA-2023-0042',
            category: 'Electronics',
            location: 'IT Lab 3',
            qty: 24,
            maxQty: 30,
            status: 'In Stock',
            statusColor: 'emerald',
            icon: 'laptop_mac'
        },
        {
            name: 'Canon Projector X500',
            serial: 'CPX-9982-11',
            category: 'AV Equipment',
            location: 'Building A - Storage',
            qty: 2,
            maxQty: 10,
            status: 'Low Stock',
            statusColor: 'orange',
            icon: 'videocam'
        },
        {
            name: 'A4 Paper Reams (Box)',
            serial: 'Supplies',
            category: 'Stationery',
            location: 'Admin Supply Closet',
            qty: 150,
            maxQty: 200,
            status: 'In Stock',
            statusColor: 'emerald',
            icon: 'print'
        },
        {
            name: 'Microscope Slide Sets',
            serial: 'Lab Supplies',
            category: 'Science',
            location: 'Chemistry Lab',
            qty: 0,
            maxQty: 50,
            status: 'Out of Stock',
            statusColor: 'red',
            icon: 'science'
        },
        {
            name: 'Basketballs (Official Size)',
            serial: 'Sports Gear',
            category: 'PE Dept',
            location: 'Gym Storage',
            qty: 18,
            maxQty: 25,
            status: 'In Stock',
            statusColor: 'emerald',
            icon: 'sports_basketball'
        }
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout>
                    <Head>
                        <title>Inventory Management - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Inventory</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Track school assets and stock levels.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-md">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>Add New Item</span>
                            </button>
                        </div>

                        {/* KPI Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Value</p>
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">monetization_on</span>
                                </div>
                                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">$124,500</p>
                                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    <span>+2.4%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-1 h-full bg-orange-400"></div>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Low Stock</p>
                                    <span className="material-symbols-outlined text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg text-xl">warning</span>
                                </div>
                                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">12 Items</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Requires immediate attention</p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending POs</p>
                                    <span className="material-symbols-outlined text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-xl">shopping_cart</span>
                                </div>
                                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">5 Orders</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Awaiting approval</p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Distributions</p>
                                    <span className="material-symbols-outlined text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg text-xl">local_shipping</span>
                                </div>
                                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">28 This Week</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Across 3 departments</p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                            <div className="flex gap-6 min-w-max">
                                <button className="flex items-center gap-2 border-b-[3px] border-primary text-slate-900 dark:text-white pb-3 pt-2">
                                    <span className="text-sm font-bold tracking-[0.015em]">Current Inventory</span>
                                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">142</span>
                                </button>
                                <button className="flex items-center gap-2 border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-all pb-3 pt-2">
                                    <span className="text-sm font-bold tracking-[0.015em]">Purchase Orders</span>
                                </button>
                                <button className="flex items-center gap-2 border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-all pb-3 pt-2">
                                    <span className="text-sm font-bold tracking-[0.015em]">Distribution Log</span>
                                </button>
                                <button className="flex items-center gap-2 border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-all pb-3 pt-2">
                                    <span className="text-sm font-bold tracking-[0.015em]">Audit History</span>
                                </button>
                            </div>
                        </div>

                        {/* Controls: Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1e2936] p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="relative w-full sm:max-w-md">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">search</span>
                                </div>
                                <input className="block w-full p-2.5 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400" placeholder="Search items, serial numbers, or suppliers..." type="text" />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                                {['Filter', 'Category', 'Location', 'Sort'].map((label, i) => (
                                    <button key={i} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[18px]">{['filter_list', 'category', 'location_on', 'sort'][i]}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inventory Table */}
                        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex-1 flex flex-col min-h-[400px]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Name</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Qty</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {inventoryItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                            <span className="material-symbols-outlined">{item.icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.serial}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.category}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.location}</span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`text-sm font-bold ${item.statusColor === 'red' ? 'text-red-600 dark:text-red-400' : item.statusColor === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>{item.qty}</span>
                                                    <span className="text-xs text-slate-500 block">/ {item.maxQty}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-${item.statusColor}-100 text-${item.statusColor}-800 dark:bg-${item.statusColor}-900/30 dark:text-${item.statusColor}-400`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full bg-${item.statusColor}-500`}></span>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        {item.status !== 'In Stock' && (
                                                            <button className="p-1.5 rounded text-primary hover:text-primary-dark hover:bg-slate-100 dark:hover:bg-slate-700" title="Restock">
                                                                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                                            </button>
                                                        )}
                                                        <button className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-bold text-slate-900 dark:text-white">1</span> to <span className="font-bold text-slate-900 dark:text-white">5</span> of <span className="font-bold text-slate-900 dark:text-white">142</span> results
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 disabled:opacity-50">Previous</button>
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
