import React from 'react';
import { UserStats, ArtStyle } from '../types';

interface StatsFormProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  disabled: boolean;
}

const StatsForm: React.FC<StatsFormProps> = ({ stats, setStats, disabled }) => {
  const handleChange = (field: keyof UserStats, value: any) => {
    setStats((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          2. 描述你的年度总结 (自由发挥)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          在这里输入关于你这一年的任何数据：职位、常用语言、代码行数、加班天数、获得的成就、甚至是你的精神状态。AI 将根据这些描述生成你的专属形象。
        </p>
        <textarea
          value={stats.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          disabled={disabled}
          rows={6}
          placeholder="例如：我是后端开发，今年主要用 Go 语言，修了 500 个 Bug，头发掉了一半但变强了..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          3. 选择美术风格
        </label>
        <select
          value={stats.artStyle}
          onChange={(e) => handleChange('artStyle', e.target.value)}
          disabled={disabled}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {Object.values(ArtStyle).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatsForm;