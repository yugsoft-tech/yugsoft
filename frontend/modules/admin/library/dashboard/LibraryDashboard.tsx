import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function LibraryDashboard() {
    const overdueItems = [
        {
            id: 1,
            borrower: {
                name: 'Alex Johnson',
                class: 'Class 10-B',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA91DnojFtASW59QBD0LT3uB4SfvaKbK9vXLiqtwiICXxYEAE3KHepQUQyHW9Go-yqCVMZ4dmfVQn7hy-yRECY5M5KBpNKTbgMQdhpT-Gje8Oy6u6OKt_xJ5WERIXqLkyGrStPSRcDXBh_DX8cj7Wgx29LFsCPkezYYx9g1nrU082ikqNvfXQD0y99bOHf9CQO53BiGaTkwj1zWCKJYRf9S9G2COdGcKDSTLEYUsb_sraXYtSfZCqmeKnruTXwnshCwMFPAzpCd4bw'
            },
            book: {
                title: 'To Kill a Mockingbird',
                isbn: '978-0446310789'
            },
            dueDate: 'Oct 24, 2023',
            fine: '$2.50'
        },
        {
            id: 2,
            borrower: {
                name: 'Mr. David Smith',
                class: 'Staff - History',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZvTKxoXbxSyCPsYHYsBOjCEOgb4DiqQldz8tvaaYhcDn3klDy4LULkjH63N_diiBhZKFIJouPsjU5v0ZS-3nelJEroZy9dOWA1FfUvYR0YanWFrjTL8kGuhkfMK5WSU8EVYNhHXwz4GO-EU9DUiBM_sswZcJT1eop4PVU_b2NwJfNbwidESEMsWfSRWZyn666cjK1dQgx9YUa5DVdgY1WWKmjg-1KO0AZFah6p3yaUkVccy-HCOuctXMND4-8DaFm7X7f1EmsN17I'
            },
            book: {
                title: 'Sapiens: A Brief History',
                isbn: '978-0062316097'
            },
            dueDate: 'Oct 25, 2023',
            fine: '$1.00'
        },
        {
            id: 3,
            borrower: {
                name: 'Liam Wong',
                class: 'Class 9-A',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXH2roaUcDE7ik008ApldJ-ot7tNLAuX9Qlx62XXrDPFq70PwEj5V6TQYvNppnGb0c539K6nQJ4Qn8irE80iQAqr7RqmoP6h28CzHei-vsbN26Tl1l-5FNdak9PczPmENygbdf3k-eJfxfdMsmEW4MbahG4KSzUD9r7z4kpNGJSCimQgYZ3N1ESYGA3xXDskezGH9nJrWjfKUzTO3xOv3FudpQEFrgmN81pBHd3sR1s6H5UMu6oWjD7FKxP91RZEIQ3eF0TLnUywdG'
            },
            book: {
                title: 'Physics for Scientists',
                isbn: '978-0134019727'
            },
            dueDate: 'Yesterday',
            fine: '$0.50'
        }
    ];

    const recentActivity = [
        { text: 'Book Returned', desc: '"The Great Gatsby" returned by Emma Watson', time: '2 mins ago', icon: 'check_circle', color: 'emerald' },
        { text: 'Book Issued', desc: '"1984" issued to James Anderson', time: '15 mins ago', icon: 'outbound', color: 'blue' },
        { text: 'New Title Added', desc: '"Dune: Part Two" added to catalog', time: '1 hour ago', icon: 'add_circle', color: 'purple' },
        { text: 'Book Issued', desc: '"Calculus Vol 1" issued to Sarah Lee', time: '2 hours ago', icon: 'outbound', color: 'blue' },
    ];

    const newArrivals = [
        { title: 'Milk and Honey', author: 'Rupi Kaur', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiftqsGIltM0Jx6XtBD_khXduK5bLFPqJn8aNa_foBQNCKf190-fAF_yj9HCsYH3G8jPn5uDwUewTJG2T1TMZ4Yys_KzYLaK0AyZJd8fCrF_MkyzUGdteNWltUg8PvCphtuSrrlOUB6KF7h2np-t7Vsw-4PWXP8OeiaW0RuKRGYpYeEfda5k_H-BEM_jxibRRCu1x68mzszwYfwIISKP9__HS6yF0fI4qzy2Tzhqp9iOO05ba7KW9p-C-6udjborQnd2_7e2Hp5TUN' },
        { title: 'Design Systems', author: 'Alla Kholmatova', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeadYxV0mNWHNOz-YPz7gGakGWcTJykTtV_CU317Q-xYjtA_dNEFbPiGgvkyHZfRke1pkzgD9ATtQ0VUnWSfbdKkDdYkll02yn_L1H4jVrTBrCDbnsm1xGtjiRQXtG9vrAd3bU3PNlAeadwy38w5rZ3o87pm8iJDdAZy4HW6vG6nBs6UYOP7JYloD2gHVsPXvYA-apoKXw2rfiCzl19JE4VeMBTEw0CaUcUDYIYyXll087MwGPMiyqL0aDT0yzgBbVcQU2VNZSn6Xk' },
        { title: 'Strategic Mgmt', author: 'Fred R. David', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgNDMXC4QAnO6jo9XK4uYHZzY_wgU9JC0TCG2Wzzp5mqMCUEv9jy_XjuBrH8rB3cTATpU0zchHsn34llEmgdpFZYOd60yomO6dasSxXsdu7pzbDwJNxEuB7cRnL3yLrC4D516P5Qi0uQXZUeidz6k3JOQSypnmD4_z2Zg-xo8b5r-UsSWoJNKbCcMB2HSzKpKgKkzr5E7I-xPr_O_62M51gAM9yu2ozQ1mDQyadq_p3xbqL3e7uz1MKJCG_HaNpyErRGK1eZsDdmQ' },
        { title: 'Modern Art', author: 'Taschen', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb3cuzrIuk4sNwoASa88coxaVPWSae3ASsBsPtosNhnImKWZxZelX7tyr8oNl1eAdYk9J3I7XGDdBIJKMGhObBfG8VyE2m-r0dDD9VcY7U6mZDfhvX7TlIzq0qWLprRXg41WsMbPX_0iqFgdA5BMzOgAgcGFMSe6oeg29fk0h1Ya68ZyFZUe8YkOZFeaM7xfDVafxAJ6WZdaWjbQT-mdrtZ7qV81ghZ0Qk8B_EVNOdsTwQReqhv_Mlpfjd8XUlsEuujYTYkPez_UtP' },
        { title: 'Psychology of Money', author: 'Morgan Housel', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb7iuxDSSMSoBYuGvW2J-0Sv9STrfXux_0gXa_u-iHJS71YFgHccHwydXH10SZQiNIjeEzMBpguu4-XmDebLVJIjOzphr9ZqqpaIczEsGTslHqwsXJylHaBfbptS4UNiGSm2vkS1l60RRxy9JOP_hBRdshmYkhGO7zLPY8os_f3aafuq9ORMviX1AnBa2Kh_ITRsAgWdGsA3XRljeGDNXLQe8-4dIMM14ORVujbkQ-nqBA-ik4XkjdgiwRDiKb28-VEiXqgehS53lm' },
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout>
                    <Head>
                        <title>Library Management - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Library Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage inventory, track borrowers, and handle daily operations.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-[#1e2936] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Collection</p>
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">library_books</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">12,450</p>
                                <p className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">trending_up</span> +12 this month
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Currently Issued</p>
                                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-lg text-xl">assignment_ind</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">342</p>
                                <p className="text-slate-400 text-sm font-medium">Active borrowers</p>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-2 ring-1 ring-red-100 dark:ring-red-900/30">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Overdue Returns</p>
                                    <span className="material-symbols-outlined text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-lg text-xl">warning</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">15</p>
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">error</span> +3 today
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Arrivals</p>
                                    <span className="material-symbols-outlined text-purple-500 bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-lg text-xl">new_releases</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">24</p>
                                <p className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">add</span> In last 30 days
                                </p>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                </div>
                                <input className="block w-full pl-12 pr-12 py-3.5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm" placeholder="Search by ISBN, Title, Author, or scan barcode..." type="text" />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined" title="Scan Barcode">barcode_reader</span>
                                </div>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0">
                                <button 
                                    onClick={() => alert('Book Issue system coming soon!')}
                                    className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-primary/30"
                                >
                                    <span className="material-symbols-outlined text-xl">outbound</span>
                                    <span>Issue Book</span>
                                </button>
                                <button 
                                    onClick={() => alert('Book Return system coming soon!')}
                                    className="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-xl">input</span>
                                    <span>Return Book</span>
                                </button>
                                <button 
                                    onClick={() => alert('Add Title system coming soon!')}
                                    className="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-xl">add</span>
                                    <span>Add Title</span>
                                </button>
                            </div>
                        </div>

                        {/* Split View: Overdue & Recent */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Left Col: Overdue List (2/3 width) */}
                            <div className="xl:col-span-2 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-red-500">warning</span>
                                        Overdue Items
                                    </h2>
                                    <button 
                                        onClick={() => alert('Complete overdue list coming soon!')}
                                        className="text-sm font-medium text-primary hover:text-blue-600 hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                    <th className="px-6 py-4 font-semibold">Borrower</th>
                                                    <th className="px-6 py-4 font-semibold">Book Title</th>
                                                    <th className="px-6 py-4 font-semibold">Due Date</th>
                                                    <th className="px-6 py-4 font-semibold">Fine</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {overdueItems.map((item) => (
                                                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${item.borrower.image}')` }}></div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{item.borrower.name}</p>
                                                                    <p className="text-xs text-slate-500">{item.borrower.class}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.book.title}</p>
                                                            <p className="text-xs text-slate-500">ISBN: {item.book.isbn}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.dueDate === 'Yesterday' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                                                                {item.dueDate}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-bold">{item.fine}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button 
                                                                onClick={() => alert('Reminder sent to ' + item.borrower.name)}
                                                                className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                Remind
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Recent Activity */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">history</span>
                                    Recent Activity
                                </h2>
                                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full">
                                    <div className="flex flex-col gap-6 relative">
                                        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                                        {recentActivity.map((activity, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 border border-white dark:border-[#1e2936] flex items-center justify-center shrink-0 z-10`}>
                                                    <span className={`material-symbols-outlined text-${activity.color === 'primary' ? 'primary' : activity.color + '-600'} dark:text-${activity.color === 'primary' ? 'primary' : activity.color + '-400'} text-sm`}>{activity.icon}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{activity.text}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.desc}</p>
                                                    <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* New Arrivals */}
                        <div className="flex flex-col gap-4 pb-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                                    New Arrivals
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {newArrivals.map((book, i) => (
                                    <div key={i} className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-500" style={{ backgroundImage: `url('${book.cover}')` }}></div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm font-bold truncate">{book.title}</p>
                                            <p className="text-slate-300 text-xs truncate">{book.author}</p>
                                        </div>
                                    </div>
                                ))}
                                <div 
                                    onClick={() => alert('Multiple book addition coming soon!')}
                                    className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400">add</span>
                                    <span className="text-sm font-medium text-slate-500">Add New</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
