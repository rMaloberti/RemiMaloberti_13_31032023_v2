import { createSlice } from '@reduxjs/toolkit';
import { selectAuth } from '../utils/selectors';

const initialState = {
  status: 'void',
  data: null,
  error: null,
};

/* Auth feature slice */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* Action: auth/fetching */
    fetching: (draft) => {
      if (draft.status === 'void') {
        draft.status = 'pending';
        return;
      }
      if (draft.status === 'rejected') {
        draft.error = null;
        draft.status = 'pending';
        return;
      }
      if (draft.status === 'resolved') {
        draft.status = 'updating';
        return;
      }
      return;
    },
    /* Action: auth/resolved */
    resolved: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.data = action.payload;
        draft.status = 'resolved';
        return;
      }
      return;
    },
    /* Action: auth/rejected */
    rejected: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.error = action.payload;
        draft.status = 'rejected';
        draft.data = null;
        return;
      }
      return;
    },
    /* Action: auth/logout */
    logout: (draft) => {
      draft.status = 'void';
      draft.data = null;
      draft.error = null;
      return;
    },
  },
});

const { actions, reducer } = authSlice;

export const { fetching, resolved, rejected, logout } = actions;

export default reducer;

/**
 * Async function to send a POST request to the API to validate user credentials and log him in.
 * @function login
 * 
 * @param {object} credentials The user's credentials.
 * @returns {void} Returns void if a request is already running.
 */
export const login = (credentials) => {
  return async (dispatch, getState) => {
    const status = selectAuth(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      dispatch(rejected(error));
    }
  };
};
