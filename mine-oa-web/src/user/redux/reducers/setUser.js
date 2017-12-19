import {SETUSER} from '../constants'

const initialState = {
    user: {}
}

export const setUser = (state = initialState, action) => {
    switch (action.type) {
        case SETUSER:
            return {
                ...state,
                user: action.user
            };
            //return Object.assign({}, ...state, {user: action.user})
        default:
            return state;
    }
}
