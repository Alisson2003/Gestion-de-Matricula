const KEY='efc_auth'
export function setAuth(d){ localStorage.setItem(KEY, JSON.stringify(d)) }
export function getAuth(){ try{ return JSON.parse(localStorage.getItem(KEY)) }catch{return null} }
export function getToken(){ return getAuth()?.token || null }
export function getUser(){ return getAuth()?.user || null }
export function clearAuth(){ localStorage.removeItem(KEY) }
