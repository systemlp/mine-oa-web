import {LOGIN} from '../constants'

const initialState = {
    user: {}
}

export const login = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user
            };
            //return Object.assign({}, ...state, {user: action.user})
        default:
            return state;
    }
}
