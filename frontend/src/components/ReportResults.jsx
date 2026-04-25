import React from 'react';
import { FileText, Stethoscope, Activity, FileWarning, AlertCircle } from 'lucide-react';

const ReportResults = ({ resultData }) => {
    if (!resultData) return null;

    return (
        <div className="bg-gray-950 p-6 md:p-12 text-gray-100 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex items-center space-x-4 border-b border-gray-800 pb-6">
                    <div className="p-3 bg-blue-900/30 rounded-lg">
                        <Activity className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Diagnostic Analysis</h1>
                        <p className="text-gray-400 mt-1">AI-Assisted Interpretation Report</p>
                    </div>
                </div>

                {/* Diagnostic Summary Card */}
                <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-xl font-semibold text-indigo-100">Diagnostic Summary</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg italic">
                        {resultData.summary}
                    </p>
                </section>

                {/* Key Recommendations List */}
                <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <Stethoscope className="w-6 h-6 text-teal-400" />
                        <h2 className="text-xl font-semibold text-teal-100">Key Recommendations</h2>
                    </div>
                    <ul className="space-y-4">
                        {resultData.recommendations?.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-3 bg-gray-800/30 p-4 rounded-xl border border-gray-800/50">
                                <AlertCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Suggested Questions (Pill Buttons) */}
                <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <FileWarning className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-semibold text-purple-100">Questions for Your Doctor</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {resultData.suggestedQuestions?.map((question, index) => (
                            <button
                                key={index}
                                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-purple-200 text-sm font-medium rounded-full border border-purple-900/30 transition-all duration-200 shadow-sm text-left"
                            >
                                "{question}"
                            </button>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ReportResults;