export type ComponentType = 'addButton' | 'background' | 'checkStyle' | 'checkboxType' | 'title';

export interface Round1Response {
  componentType: ComponentType;
  selected: 'A' | 'B';
}

export interface TournamentMatch {
  id: number;
  left: number; // UI design ID
  right: number; // UI design ID
  winner?: number; // UI design ID
  responseTime?: number; // Time in milliseconds
  confidence?: number; // Confidence rating (1-7)
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface TournamentResult {
  uiId: number;
  wins: number;
  losses: number;
  totalMatches?: number;
  winPercentage?: number;
  finalRank?: number;
}

export interface SurveyResults {
  round1: Round1Response[];
  tournamentResults: TournamentResult[];
  finalRanking: number[]; // Ordered list of UI IDs from best to worst
}

