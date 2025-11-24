import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MarketGlimpse = () => {
    const router = useRouter();

    // Mock data matching the structure in market/page.js
    const marketData = [
        {
            id: 'wheat',
            name: 'गेहूं (Wheat)',
            price: 2450,
            change: 70,
            trend: 'up',
            unit: 'quintal'
        },
        {
            id: 'rice',
            name: 'चावल (Rice)',
            price: 3200,
            change: 50,
            trend: 'up',
            unit: 'quintal'
        },
        {
            id: 'maize',
            name: 'मक्का (Maize)',
            price: 1850,
            change: -70,
            trend: 'down',
            unit: 'quintal'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Market Glimpse
                    </h2>
                    <p className="text-sm text-gray-500">Live Mandi Prices (बाज़ार भाव)</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/market')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {marketData.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${item.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <p className="text-xs text-gray-500">per {item.unit}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-bold text-gray-900 text-lg">₹{item.price.toLocaleString()}</div>
                            <div className={`text-xs font-medium flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {item.trend === 'up' ? '+' : ''}₹{Math.abs(item.change)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Prices updated: Today, 10:30 AM
                </div>
            </div>
        </div>
    );
};

export default MarketGlimpse;
