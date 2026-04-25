import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const SystemAnalytics = ({ similarityScore }) => {
    // Demo data for the presentation charts
    const latencyData = [
        { name: 'Initial Load', API: 420, Compute: 5, Network: 80 },
        { name: 'Translation', API: 380, Compute: 8, Network: 95 },
        { name: 'RAG Query', API: 510, Compute: 4, Network: 70 },
    ];

    const similarityData = [
        { id: 1, score: 0.82 },
        { id: 2, score: 0.15 },
        { id: 3, score: parseFloat(similarityScore) || 0.78 }
    ];

    return (
        <div className="mt-12 border-t border-gray-800 pt-12 pb-20 bg-gray-950">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    System Engineering Dashboard
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Latency Breakdown Graph */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                        <h3 className="text-gray-400 font-medium mb-6">Latency Breakdown (ms)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={latencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="API" stackId="a" fill="#6366f1" />
                                <Bar dataKey="Compute" stackId="a" fill="#10b981" />
                                <Bar dataKey="Network" stackId="a" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Semantic Confidence Plot */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                        <h3 className="text-gray-400 font-medium mb-6">Semantic Confidence (Threshold: 0.45)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis type="number" dataKey="id" name="Query" stroke="#6b7280" hide />
                                <YAxis type="number" dataKey="score" domain={[0, 1]} stroke="#6b7280" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Matches" data={similarityData} fill="#8b5cf6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                            <span className="italic">*Threshold 0.45 active</span>
                            <span className="text-blue-400 font-mono">Status: Optimized</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemAnalytics;