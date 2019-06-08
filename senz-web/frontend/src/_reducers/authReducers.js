import {
  AUTHENTICATED,
  UNAUTHENTICATED,
  AUTHENTICATION_ERROR,
  CLEAR_ALL
} from "../_actions/types/index";
export default function(state = {}, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return { ...state, authenticated: true, user: action.payload };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false, user: {} };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ALL:
      return {};
    default:
      return state;
  }
}