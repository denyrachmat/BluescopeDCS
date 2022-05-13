/*
export function someMutation (state) {
}
*/
export function AuthStoreMutation(state, payload) {
    state.authDet = payload
}

export function DomainMutation(state, payload) {
    state.rootDomain = payload
}

export function ListMutation(state, payload) {
    state.storedList = payload
}
