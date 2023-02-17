import { getRequests } from "../http";
import { getAccessToken } from "../config/localstorage";
import { SuggestionsResponse } from "../config/types";

const requests = getRequests({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});

export const fetchSuggestions = (): Promise<SuggestionsResponse> => requests.get(`/suggestions`);
