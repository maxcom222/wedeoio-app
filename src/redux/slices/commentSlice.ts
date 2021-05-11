import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from 'config/firebase';

export const createComment = createAsyncThunk(
  'player/createCommentStatus',
  async (params: any, { getState, rejectWithValue }) => {
    const state: any = getState();

    try {
      const data = {
        ...params,
        commenter: {
          name: state.auth.user.name,
          uid: state.auth.user.uid,
        },
        createdAt: Date.now(),
        isComplete: false,
        followers: [],
        replies: [],
      };
      const ref = db.collection('comments').doc();
      await db.collection('comments').doc(ref.id).set(data);

      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  'player/updateCommentStatus',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      await db.collection('comments').doc(id).update(data);

      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteCommentStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      await db.collection('comments').doc(id).delete();
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }

    return;
  }
);

export const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    data: [],
    loading: false,

    deleting: false,
  },
  reducers: {
    setComments: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createComment.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteComment.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(deleteComment.fulfilled, (state) => {
      state.deleting = false;
    });
  },
});

export const { setComments } = commentSlice.actions;

export default commentSlice.reducer;
