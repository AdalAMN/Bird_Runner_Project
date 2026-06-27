export interface GameSessionInput {
  userId: string;
  score: number;
}

export interface GameSessionResponse {
  id: string;
  userId: string;
  score: number;
  playedAt: Date;
}

export interface RankingEntry {
  userId: string;
  userName: string;
  email: string;
  highestScore: number;
}
