import { createSlice } from '@reduxjs/toolkit';
import { selectTransactionDetails } from '../utils/selectors';

const initialState = {
  status: 'void',
  data: null,
  error: null,
};

/* Transactions feature slice */
const transactionDetailsSlice = createSlice({
  name: 'transactionDetails',
  initialState,
  reducers: {
    /* Action: transactions/fetching */
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
    /* Action: transactions/rejected */
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

const { actions, reducer } = transactionDetailsSlice;

export const { fetching, resolved, rejected } = actions;

export default reducer;

/**
 * Async function to send a POST request to the API to get the transactionDetails data.
 * @function fetchOrUpdateTransactionDetails
 *
 * @param {string} authToken The authentication token stored in the auth store.
 * @param {string} transactionId The id of the transaction to get.
 * @returns {void} Returns void if a request is already running.
 */
export const fetchOrUpdateTransactionDetails = (authToken, transactionId) => {
  return async (dispatch, getState) => {
    const status = selectTransactionDetails(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/transactions/details', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          transactionId: transactionId,
        }),
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      console.log(error);
      dispatch(rejected(error));
    }
  };
};

/**
 * Async function to send a PUT request to the API to edit the transactionDetails data.
 * @function editTransactionDetails
 *
 * @param {string} authToken The authentication token stored in the auth store.
 * @param {string} transactionId The id of the transaction to get.
 * @returns {void} Returns void if a request is already running.
 */
export const editTransactionDetails = (authToken, transactionId, newData) => {
  return async (dispatch, getState) => {
    const status = selectTransactionDetails(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/transactions/details', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          transactionId: transactionId,
          category: newData.category,
          notes: newData.notes,
        }),
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      console.log(error);
      dispatch(rejected(error));
    }
  };
};
