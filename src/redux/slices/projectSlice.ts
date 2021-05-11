import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from 'config/firebase';
import {
  addUserProject,
  updateUserProject,
  deleteUserProject,
} from './authSlice';

export const fetchProject = createAsyncThunk(
  'project/fetchProjectStatus',
  async (id: any, { rejectWithValue }) => {
    try {
      const project = await db.collection('projects').doc(id).get();
      return { ...project.data(), id: id };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createStatus',
  async (params: any, { dispatch, rejectWithValue }) => {
    try {
      const project = await (
        await db.collection('projects').add({
          name: params.name,
          teamId: params.teamId,
          createdAt: Date.now(),
        })
      ).get();
      dispatch(addUserProject({ id: project.id, ...project.data() }));
      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProjectStatus',
  async (params: any, { dispatch, rejectWithValue }) => {
    try {
      await db
        .collection('projects')
        .doc(params.id)
        .update({ name: params.name });
      await dispatch(updateUserProject(params));
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProjectStatus',
  async (params: any, { dispatch, rejectWithValue }) => {
    try {
      await db.collection('projects').doc(params.id).delete();
      await dispatch(deleteUserProject(params));
      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    data: null,
    loading: false,

    creating: false,
    updating: false,
    deleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });

    builder.addCase(createProject.pending, (state) => {
      state.creating = true;
    });
    builder.addCase(createProject.fulfilled, (state) => {
      state.creating = false;
    });

    builder.addCase(updateProject.pending, (state) => {
      state.updating = true;
    });
    builder.addCase(updateProject.fulfilled, (state) => {
      state.updating = false;
    });

    builder.addCase(deleteProject.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(deleteProject.fulfilled, (state) => {
      state.deleting = false;
    });
  },
});

export default projectSlice.reducer;
