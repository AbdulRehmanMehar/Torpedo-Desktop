import { ProductResponse, SuggestionsResponse } from "../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  suggestions: SuggestionsResponse | undefined;
}

export type SuggestionsStore = State;

const initalState: State = {
  suggestions: undefined
};

const suggestionsReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.GET_SUGGESTIONS:    
      return {
        ...state,
        suggestions: action.payload,
      }

    default: 
      return state;
  }
};

export default suggestionsReducer;