import { getRequests } from "../http";
import { getAccessToken } from "../config/localstorage";
import { SuggestionsResponse } from "../config/types";


export const fetchSuggestions = (): Promise<SuggestionsResponse> => {
    let token = getAccessToken();
    while(!token) {
        token = getAccessToken();
    }

    const requests = getRequests({
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return requests.get(`/suggestions`);
};
