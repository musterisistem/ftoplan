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
        <div className="bg-white rounded-xl p-6 border border-gray-100 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-6 relative z-10">Depolama Kullanımı</h3>

            {/* Water Container */}
            <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Glass Container */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 bg-gradient-to-b from-blue-50/20 to-blue-50/40"></div>

                {/* Water Fill */}
                <div
                    className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out overflow-hidden"
                    style={{ height: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300">
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
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                            {percentage.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="text-center space-y-1 relative z-10">
                <div className="text-sm font-medium text-gray-900">
                    {usedGB} GB / {limitGB} GB
                </div>
                <div className="text-xs text-gray-500">
                    Kullanılabilir: {(parseFloat(limitGB) - parseFloat(usedGB)).toFixed(2)} GB
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
