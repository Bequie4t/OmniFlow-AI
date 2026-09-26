import React from 'react';
import { SHOWCASE_PRESETS } from '@/data/showcases';
import type { ShowcasePreset } from '../types';
import { Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';

interface Props {
  onSelectPreset: (preset: ShowcasePreset) => void;
}

export default function ShowcaseGallery({ onSelectPreset }: Props) {
  return (
    <div className="mt-8 pt-8 border-t border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            엔터프라이즈 실전 쇼케이스 갤러리
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">클릭 시 기획 데이터가 좌측 입력 패널에 즉시 로드됩니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHOWCASE_PRESETS.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#0d0f14] border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {item.category}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {item.metrics.timeSaved}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-200 line-clamp-1 mb-2 group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h5>

              <div className="space-y-1.5 text-[11px] text-slate-400 mb-4 bg-[#12151c] p-2.5 rounded-lg border border-slate-800/80">
                <p><strong className="text-indigo-300">[PM]</strong> {item.roleContribution.pm}</p>
                <p><strong className="text-purple-300">[Tech]</strong> {item.roleContribution.tech}</p>
                <p><strong className="text-pink-300">[Visual]</strong> {item.roleContribution.creative}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Cost: {item.metrics.costReduction}</span>
              <button
                onClick={() => onSelectPreset(item)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>프리셋 로드</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}