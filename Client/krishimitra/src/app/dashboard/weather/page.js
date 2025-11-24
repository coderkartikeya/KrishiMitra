'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/NavBar';
import WeatherWidget from '../../../components/dashboard/WeatherWidget';

export default function WeatherPage() {
    const router = useRouter();

    const handleTabChange = (tabId) => {
        router.push(tabId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar activeTab="/dashboard/weather" onTabChange={handleTabChange} />

            <div className="md:ml-80 pt-20 px-4 md:px-8 pb-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
                        <p className="text-gray-600">Real-time weather updates and farming advisories</p>
                    </div>

                    <WeatherWidget location="Meerut, UP" />
                </div>
            </div>
        </div>
    );
}
