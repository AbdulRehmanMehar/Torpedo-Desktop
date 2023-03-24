import { SuggestionsResponse } from "../../config/types";

export enum ActionTypes {
  GET_SUGGESTIONS = 'GET_SUGGESTIONS',
}

interface GetSuggestions {
  type: ActionTypes.GET_SUGGESTIONS;
  payload: SuggestionsResponse;
}
export type Action = GetSuggestions;