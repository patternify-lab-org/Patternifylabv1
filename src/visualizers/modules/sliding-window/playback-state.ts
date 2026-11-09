export type PlaybackState = {
  cursor: number;
  playing: boolean;
  speed: "slow" | "steady" | "fast";
};

export type PlaybackAction =
  | { type: "previous" }
  | { type: "next" }
  | { type: "seek"; cursor: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "tick" }
  | { type: "reset" }
  | { type: "speed"; speed: PlaybackState["speed"] };

export const initialPlaybackState: PlaybackState = {
  cursor: 0,
  playing: false,
  speed: "steady"
};

export function transitionPlayback(
  state: PlaybackState,
  action: PlaybackAction,
  stepCount: number
): PlaybackState {
  const last = Math.max(0, stepCount - 1);
  switch (action.type) {
    case "previous":
      return { ...state, cursor: Math.max(0, state.cursor - 1), playing: false };
    case "next":
      return { ...state, cursor: Math.min(last, state.cursor + 1), playing: false };
    case "seek":
      return { ...state, cursor: Math.min(last, Math.max(0, action.cursor)), playing: false };
    case "play":
      return { ...state, cursor: state.cursor >= last ? 0 : state.cursor, playing: stepCount > 1 };
    case "pause":
      return { ...state, playing: false };
    case "tick":
      return state.cursor >= last
        ? { ...state, cursor: last, playing: false }
        : { ...state, cursor: state.cursor + 1 };
    case "reset":
      return { ...state, cursor: 0, playing: false };
    case "speed":
      return { ...state, speed: action.speed };
  }
}
