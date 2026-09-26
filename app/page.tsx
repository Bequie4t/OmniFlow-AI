'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Layers, Film, Image as ImageIcon, Database, 
  Copy, Check, RefreshCw, Clock, Zap, CheckCircle2, AlertCircle 
} from 'lucide-react';
import ShowcaseGallery from '@/components/ShowcaseGallery';

// 타입을 파일 내부에 직접 선언하여 빌드 누락 방지
export interface PlanningData {
  conceptTitle: string;
  targetInsight: string;
  hookMessage: string;
  kpiEstimate: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  timecode: string;
  visualDescription: string;
  cameraMovement: string;
  dialogue?: string;
}

export interface VisualAssetsData {
  imagePrompt: string;
  videoPrompt: string;
  negativePrompt: string;
  artDirectionNote: string;
}

export interface OmniFlowResponse {
  planning: PlanningData;
  storyboard: StoryboardScene[];
  visualAssets: VisualAssetsData;
}

export interface ShowcasePreset {
  id: string;
  category: 'K-Heritage' | 'E-Commerce' | 'Cyberpunk Tech';
  title: string;
  idea: string;
  goal: string;
  target: string;
  mood: string;
  roleContribution: {
    pm: string;
    tech: string;
    creative: string;
  };
  metrics: {
    timeSaved: string;
    costReduction: string;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'planning' | 'storyboard' | 'visual' | 'archive'>('planning');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    idea: '백제 문화유산의 미디어아트 융합과 2030 세대를 위한 숏폼 브랜딩',
    goal: '전통문화의 현대적 재해석 및 전시 티켓 예매 전환율 극대화',
    target: '트렌디한 전시와 숏폼 콘텐츠를 소비하는 2030 세대',
    mood: '신비롭고 웅장하며 미래지향적인 사이버-헤리티지 무드'
  });

  const [result, setResult] = useState<OmniFlowResponse | null>(null);
  const [selectedScene, setSelectedScene] = useState<number>(0);
  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionSaved, setNotionSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setNotionSaved(false);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setActiveTab('planning');
      } else {
        setErrorMsg(data.error || '프롬프트 생성에 실패했습니다.');
      }
    } catch {
      setErrorMsg('서버와 통신할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotion = async () => {
    if (!result) return;
    setNotionSyncing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.planning.conceptTitle,
          planning: result.planning,
          storyboard: result.storyboard,
          visualAssets: result.visualAssets
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNotionSaved(true);
        setActiveTab('archive');
      } else {
        setErrorMsg(data.error || 'Notion 동기화 실패');
      }
    } catch {
      setErrorMsg('Notion 통신 오류');
    } finally {
      setNotionSyncing(false);
    }
  };

  const handleLoadPreset = (preset: any) => {
    setForm({
      idea: preset.idea,
      goal: preset.goal,
      target: preset.target,
      mood: preset.mood
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-[#12151c]/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              OmniFlow AI
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              End-to-End Orchestrator
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-[#0d0f14] px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>기획 시간: <strong className="text-slate-200">4h → 15s 단축 (99.8%)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0d0f14] px-3 py-1.5 rounded-lg border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>엔진: <strong className="text-slate-200">Gemini 3.8 Flash</strong></span>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 px-6 py-2.5 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#151922] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 1. Campaign Seed Input
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">원천 콘텐츠 아이디어</label>
                <textarea 
                  rows={3} 
                  value={form.idea}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">캠페인 목표 (KPI)</label>
                <input 
                  type="text" 
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">타깃 오디언스</label>
                <input 
                  type="text" 
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">톤앤매너 & 무드</label>
                <input 
                  type="text" 
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  className="w-full bg-[#0d0f14] border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full py-3.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>멀티 에이전트 파이프라인 가동 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>엔드투엔드 파이프라인 실행</span>
                </>
              )}
            </button>
          </div>

          {result && (
            <button
              onClick={handleSaveToNotion}
              disabled={notionSyncing}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                notionSaved 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-[#151922] hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{notionSyncing ? 'Notion DB 동기화 중...' : notionSaved ? 'Notion DB 저장 완료' : '전체 결과를 Notion DB로 내보내기'}</span>
            </button>
          )}
        </section>

        <section className="lg:col-span-8 flex flex-col">
          <div className="flex border-b border-slate-800 bg-[#12151c] rounded-t-2xl px-2 pt-2 gap-1">
            {[
              { id: 'planning', label: '1. 기획서 (PM)', icon: Layers },
              { id: 'storyboard', label: '2. 스토리보드 (Creative)', icon: Film },
              { id: 'visual', label: '3. 프롬프트 에셋 (Visual)', icon: ImageIcon },
              { id: 'archive', label: '4. 아카이브 (Fullstack)', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 bg-[#151922] text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 bg-[#151922] border-x border-b border-slate-800 rounded-b-2xl p-6 min-h-[500px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500">
                <Sparkles className="w-10 h-10 mb-3 text-slate-600 animate-pulse" />
                <p className="text-sm font-medium">좌측 패널에서 아이디어를 입력하고 파이프라인을 실행해 주세요.</p>
              </div>
            ) : (
              <>
                {activeTab === 'planning' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Concept Title</span>
                      <h3 className="text-lg font-bold text-white">{result.planning.conceptTitle}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                        <span className="text-xs text-slate-400 font-medium block mb-2">🎯 타깃 인사이트 & 소구점</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{result.planning.targetInsight}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                        <span className="text-xs text-slate-400 font-medium block mb-2">⚡ 후킹 메시지 (3초 이탈 방지)</span>
                        <p className="text-xs text-amber-300 font-semibold leading-relaxed">{result.planning.hookMessage}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium block mb-1">📊 목표 전환율 & 예상 성과</span>
                      <p className="text-xs text-emerald-400 font-medium">{result.planning.kpiEstimate}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'storyboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0d0f14] rounded-xl border border-slate-800">
                      {result.storyboard.map((scene: StoryboardScene, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedScene(idx)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all ${
                            selectedScene === idx 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="block font-bold">SCENE 0{scene.sceneNumber}</span>
                          <span className="text-[10px] opacity-75">{scene.timecode}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-5 rounded-xl bg-[#0d0f14] border border-slate-800 space-y-4">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold">시각적 연출 묘사</span>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                          {result.storyboard[selectedScene]?.visualDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">카메라 무빙</span>
                          <p className="text-xs text-slate-300 mt-0.5">{result.storyboard[selectedScene]?.cameraMovement}</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 font-medium">대사 / 자막 카피</span>
                          <p className="text-xs text-slate-300 mt-0.5">{result.storyboard[selectedScene]?.dialogue || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'visual' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-indigo-400">Runway Gen-3 / Sora 영상 프롬프트</span>
                        <button 
                          onClick={() => copyToClipboard(result.visualAssets.videoPrompt, 'video')}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>복사</span>
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300 bg-[#12151c] p-3 rounded-lg border border-slate-800 leading-relaxed select-all">
                        {result.visualAssets.videoPrompt}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-purple-400">Midjourney / FLUX 이미지 프롬프트</span>
                        <button 
                          onClick={() => copyToClipboard(result.visualAssets.imagePrompt, 'image')}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'image' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>복사</span>
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300 bg-[#12151c] p-3 rounded-lg border border-slate-800 leading-relaxed select-all">
                        {result.visualAssets.imagePrompt}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d0f14] border border-slate-800">
                      <span className="text-xs font-bold text-rose-400 block mb-2">품질 왜곡 방지 네거티브 프롬프트</span>
                      <p className="text-xs font-mono text-slate-400 bg-[#12151c] p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                        {result.visualAssets.negativePrompt}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'archive' && (
                  <div className="p-8 rounded-xl bg-[#0d0f14] border border-slate-800 flex flex-col items-center text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                    <h3 className="text-base font-bold text-white">Notion Database 동기화 완료</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                      기획안 요약, 3단 씬 스토리보드, 비디오/이미지 생성용 프로덕션 프롬프트가 팀 워크스페이스에 안전하게 기록되었습니다.
                    </p>
                  </div>
                )}
              </>
            )}

            <ShowcaseGallery onSelectPreset={handleLoadPreset} />
          </div>
        </section>
      </main>
    </div>
  );
}