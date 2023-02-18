import { AuthenticationStore } from "../pages/Authentication/Store/Reducers"
import { AUTH_STORE_KEY } from "./constants"

export const setLocalStorageWithExpiry = (key: string, value: any, ttl: number) => {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + (ttl * 1000),
	}
	localStorage.setItem(key, JSON.stringify(item))
}

export const getLocalStorageWithExpiry = (key: string) => {
	const itemStr = localStorage.getItem(key);

	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key)
		return null
	}
    
	return item.value
}

export const removeLocalStorage = (key: string) => {
	localStorage.removeItem(key)
}

export const getAccessToken = () => {
	const auth = getLocalStorageWithExpiry(AUTH_STORE_KEY) as AuthenticationStore;
	return (auth || {}).token;
}