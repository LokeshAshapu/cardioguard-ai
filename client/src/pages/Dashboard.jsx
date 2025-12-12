import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, AlertOctagon, Heart, Phone, ArrowLeft, CheckCircle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [prediction, setPrediction] = useState(location.state?.prediction || null);

    // In a real app, if no state, fetch latest history
    useEffect(() => {
        if (!prediction) {
            // Fetch logic would go here
        }
    }, [prediction]);

    if (!prediction) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center dark:bg-bgDark p-8 text-center">
                <div className="bg-white/5 dark:bg-cardDark p-10 rounded-2xl glass-panel">
                    <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Recent Analysis</h2>
                    <p className="text-slate-500 mb-6">Start a new health assessment to get AI insights.</p>
                    <Link to="/assess" className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all">Start Assessment</Link>
                </div>
            </div>
        );
    }

    const { statisticalRisk, aiAnalysis, finalStatus, guidelines } = prediction;
    const isCritical = finalStatus === 'Critical' || finalStatus === 'High';

    const handleDownloadPDF = async () => {
        const element = document.getElementById('dashboard-content');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`CardioGuard_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to download report. Please try again.");
        }
    };

    const handleEmergencyCall = () => {
        window.location.href = 'tel:911';
    };

    return (
        <div id="dashboard-content" className={`min-h-screen p-6 md:p-8 transition-colors ${isCritical ? 'bg-red-50 dark:bg-red-950/20' : 'bg-slate-50 dark:bg-bgDark'}`}>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/assess" className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold">Health Risk Analysis</h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider ${finalStatus === 'Critical' ? 'bg-red-600 text-white animate-pulse' :
                        finalStatus === 'High' ? 'bg-orange-500 text-white' :
                            finalStatus === 'Medium' ? 'bg-yellow-500 text-white' :
                                'bg-green-500 text-white'
                        }`}>
                        {finalStatus} Risk
                    </div>
                </div>

                {/* Emergency Alert Banner */}
                {isCritical && (
                    <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                            <AlertOctagon className="w-12 h-12" />
                            <div>
                                <h2 className="text-xl font-bold">EMERGENCY ALERT: High Cardiovascular Risk Detected</h2>
                                <p className="opacity-90">Please seek immediate medical attention or contact emergency services.</p>
                            </div>
                        </div>
                        <button onClick={handleEmergencyCall} className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 flex items-center gap-2">
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Stats & AI */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Risk Scores */}
                        <div className="glass-panel p-6 bg-white dark:bg-cardDark">
                            <h3 className="text-lg font-semibold mb-4">Risk Probability Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <span className="text-slate-500 text-sm">Heart Attack</span>
                                    <div className="text-3xl font-bold text-primary mt-1">{statisticalRisk.heartAttackProb}%</div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-2">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${statisticalRisk.heartAttackProb}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <span className="text-slate-500 text-sm">Stroke</span>
                                    <div className="text-3xl font-bold text-amber-500 mt-1">{statisticalRisk.strokeProb}%</div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-2">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${statisticalRisk.strokeProb}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <span className="text-slate-500 text-sm">Diabetic Shock</span>
                                    <div className="text-3xl font-bold text-purple-500 mt-1">{statisticalRisk.diabeticProb}%</div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-2">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${statisticalRisk.diabeticProb}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div className="glass-panel p-6 bg-white dark:bg-cardDark border-l-4 border-l-primary">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold">Dr. AI Analysis</h3>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed">{aiAnalysis.analysis}</p>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Explanations:</h4>
                                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                                        {aiAnalysis.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Guidelines & Actions */}
                    <div className="space-y-6">

                        {/* Recommendations */}
                        <div className="glass-panel p-6 bg-white dark:bg-cardDark">
                            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Immediate Actions</h3>
                            <ul className="space-y-3">
                                {aiAnalysis.recommendations.map((rec, i) => (
                                    <li key={i} className="flex gap-3 items-start p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300 text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Clinical Guidelines Alerts */}
                        {guidelines.length > 0 && (
                            <div className="glass-panel p-6 bg-white dark:bg-cardDark">
                                <h3 className="text-lg font-semibold mb-4 text-slate-500">Clinical Alerts</h3>
                                <div className="space-y-3">
                                    {guidelines.map((alert, i) => (
                                        <div key={i} className="p-3 border-l-2 border-amber-500 bg-amber-50 dark:bg-amber-900/10">
                                            <p className="font-bold text-amber-700 dark:text-amber-500 text-xs uppercase mb-1">{alert.level} - {alert.source}</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{alert.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="glass-panel p-6 bg-white dark:bg-cardDark">
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Download Full Report
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
