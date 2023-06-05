import { createSlice } from '@reduxjs/toolkit';
import { selectProfile } from '../utils/selectors';

const initialState = {
  status: 'void',
  data: null,
  error: null,
};

/* Profile feature slice */
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    /* Action: profile/fetching */
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
    /* Action: profile/resolved */
    resolved: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.data = action.payload;
        draft.status = 'resolved';
        return;
      }
      return;
    },
    /* Action: profile/rejected */
    rejected: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.error = action.payload;
        draft.data = null;
        draft.status = 'rejected';
        return;
      }
      return;
    },
  },
});

const { actions, reducer } = profileSlice;

export const { fetching, resolved, rejected } = actions;

export default reducer;

/**
 * Async function to send a POST request to the API to get the profile data.
 * @function fetchOrUpdateProfile
 * 
 * @param {string} authToken The authentication token stored in the auth store.
 * @returns {void} Returns void if a request is already running.
 */
export const fetchOrUpdateProfile = (authToken) => {
  return async (dispatch, getState) => {
    const status = selectProfile(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      dispatch(rejected(error));
    }
  };
};

/**
 * Async function to send a PUT request to the API to edit the profile data.
 * @function editProfile
 * 
 * @param {string} authToken The authentication token stored in the auth store.
 * @param {object} newData The new first and last names entered by the user.
 * @returns {void} Returns void if a request is already running.
 */
export const editProfile = (authToken, newData) => {
  return async (dispatch, getState) => {
    const status = selectProfile(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newData),
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      dispatch(rejected(error));
    }
  };
};