export type Difficulty = 'easy' | 'medium' | 'hard';

export type Feedback = 'green' | 'yellow' | 'grey';

export interface Puzzle {
  id: number;
  route: string[];           // ordered country names, full answer
  visibleIndexes: number[];  // default reveal positions (medium difficulty)
  decoys: string[];          // wrong-answer options to mix into the picker
  region: string;            // shown only on Easy mode
  difficultyRating: 1 | 2 | 3; // editorial difficulty hint
}

export interface Attempt {
  guesses: string[];      // length = number of blanks
  feedback: Feedback[];   // length = number of blanks
}

export type Screen = 'start' | 'playing' | 'result' | 'privacy';
