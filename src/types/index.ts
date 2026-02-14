export interface Kid {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

export interface Mission {
  id: string;
  title: string;
  points: number;
  icon: string;
  completed?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface MissionLog {
  id: string;
  kidId: string;
  missionId: string;
  completedAt: string;
}
