import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { idea, goal, target, mood } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
당신은 최고 수준의 AI 크리에이티브 디렉터이자 테크니컬 프로덕트 매니저(PM)입니다.
다음 캠페인 정보를 바탕으로 기획서, 3단계 스토리보드, 비주얼 생성 프롬프트를 구성해 주세요.
- 캠페인 아이디어: ${idea}
- 목표 KPI: ${goal}
- 타깃 오디언스: ${target}
- 톤앤매너: ${mood}

[원칙]
1. 추상적인 표현 대신 렌즈 구경, 조명 각도, 입자 묘사 등 구체적인 시각 물리 언어를 사용하세요.
2. 한국 전통문화 요소는 Baekje, Silla, Joseon, Hanbok 등으로 구체화하고 네거티브에 중국/일본 양식 차단어를 포함하세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planning: {
              type: Type.OBJECT,
              properties: {
                conceptTitle: { type: Type.STRING },
                targetInsight: { type: Type.STRING },
                hookMessage: { type: Type.STRING },
                kpiEstimate: { type: Type.STRING }
              },
              required: ['conceptTitle', 'targetInsight', 'hookMessage', 'kpiEstimate']
            },
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  timecode: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  dialogue: { type: Type.STRING }
                },
                required: ['sceneNumber', 'timecode', 'visualDescription', 'cameraMovement']
              }
            },
            visualAssets: {
              type: Type.OBJECT,
              properties: {
                imagePrompt: { type: Type.STRING },
                videoPrompt: { type: Type.STRING },
                negativePrompt: { type: Type.STRING },
                artDirectionNote: { type: Type.STRING }
              },
              required: ['imagePrompt', 'videoPrompt', 'negativePrompt', 'artDirectionNote']
            }
          },
          required: ['planning', 'storyboard', 'visualAssets']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('응답 데이터를 받아오지 못했습니다.');
    }

    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '서버 통신 오류' }, { status: 500 });
  }
}