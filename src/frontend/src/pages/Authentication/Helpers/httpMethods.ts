import requests from "../../../http";
import { AuthenticationCredentials, AuthenticationResponse } from "../../../config/types";

export const login = (credentials: AuthenticationCredentials): Promise<AuthenticationResponse> => requests.post('/login', {...credentials});
