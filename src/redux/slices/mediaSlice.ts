import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from 'config/firebase';

export const fetchMedia = createAsyncThunk(
  'player/fetchMediaStatus',
  async (id: any, { rejectWithValue }) => {
    try {
      const file = await db.collection('files').doc(id).get();

      return {
        id,
        ...file.data(),
      };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const mediaSlice = createSlice({
  name: 'player',
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMedia.pending, (state) => {
      state.data = null;
      state.loading = true;
    });
    builder.addCase(fetchMedia.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
  },
});

export default mediaSlice.reducer;
