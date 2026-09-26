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