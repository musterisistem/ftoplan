import { LucideIcon, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    iconColor?: 'purple' | 'blue' | 'orange' | 'green' | 'red';
    linkText?: string;
}

const colorMap = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function StatsCard({ title, value, icon: Icon, trend, iconColor = 'purple', linkText = 'Detayları gör' }: StatsCardProps) {
    const colors = colorMap[iconColor];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={clsx("p-3 rounded-2xl", colors.bg, colors.text)}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={clsx(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        trend.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                    )}>
                        {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
                <p className="text-sm font-medium text-gray-500">{title}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between group cursor-pointer">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-primary-600 transition-colors">
                    {linkText}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors transform group-hover:translate-x-1" />
            </div>
        </div>
    );
}
