// Add to DashboardComponents.tsx - Water Fill Storage Animation

interface WaterFillStorageProps {
    used: number;
    limit: number;
}

export function WaterFillStorage({ used, limit }: WaterFillStorageProps) {
    const percentage = (used / limit) * 100;
    const usedGB = (used / 1024 / 1024 / 1024).toFixed(2);
    const limitGB = (limit / 1024 / 1024 / 1024).toFixed(2);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-6 relative z-10">Depolama Kullanımı</h3>

            {/* Water Container */}
            <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Glass Container */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 bg-gradient-to-b from-indigo-50/30 to-indigo-50/60 shadow-inner"></div>

                {/* Water Fill */}
                <div
                    className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out overflow-hidden"
                    style={{ height: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-500 to-violet-400">
                        {/* Wave Animation */}
                        <div className="absolute inset-0 opacity-60">
                            <svg className="absolute w-full" style={{ bottom: '-5px' }} viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill="rgba(255,255,255,0.3)"
                                    d="M0,50 Q360,20 720,50 T1440,50 L1440,100 L0,100 Z"
                                >
                                    <animate
                                        attributeName="d"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        values="
                                            M0,50 Q360,20 720,50 T1440,50 L1440,100 L0,100 Z;
                                            M0,50 Q360,80 720,50 T1440,50 L1440,100 L0,100 Z;
                                            M0,50 Q360,20 720,50 T1440,50 L1440,100 L0,100 Z
                                        "
                                    />
                                </path>
                            </svg>
                        </div>

                        {/* Bubbles */}
                        <div className="absolute inset-0">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white/40 rounded-full animate-bubble"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        animationDelay: `${i * 0.5}s`,
                                        animationDuration: `${2 + i * 0.3}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Percentage Display */}
                <div className="absolute inset-0 flex items-center justify-center z-10 shadow-sm">
                    <div className="text-center bg-white/40 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        <div className="text-[1.1rem] font-black text-indigo-900 tracking-tighter">
                            {percentage.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="text-center space-y-1 relative z-10">
                <div className="text-[15px] font-bold text-gray-800">
                    {usedGB} GB / {limitGB} GB
                </div>
                <div className="text-[11px] font-semibold text-gray-400 border border-gray-100 bg-gray-50 px-3 py-1 rounded-lg inline-block shadow-sm">
                    Kalan: {(parseFloat(limitGB) - parseFloat(usedGB)).toFixed(2)} GB
                </div>
            </div>

            <style jsx>{`
                @keyframes bubble {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0.5);
                        opacity: 0;
                    }
                }
                .animate-bubble {
                    animation: bubble linear infinite;
                }
            `}</style>
        </div>
    );
}
