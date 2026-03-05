export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: 'Male' | 'Female';
  dob: string;
  centerName: string;
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  playerId: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  numberOfBalls: number;
  bestStreak: number;
  numberOfGoals: number;
  score: number;
  avgSpeedOfPlay: number;
  numberOfExercises: number;
}

export interface Appointment {
  id: string;
  playerId: string;
  trainerName: string;
  startTime: string;
  endTime: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
