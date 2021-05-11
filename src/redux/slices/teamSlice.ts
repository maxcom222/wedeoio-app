import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db, _db } from 'config/firebase';
import { updateUserTeam } from './authSlice';

export const fetchTeam = createAsyncThunk(
  'team/fetchTeamStatus',
  async (id: any, { getState, rejectWithValue }) => {
    try {
      const team = await db.collection('teams').doc(id).get();
      return { id: id, ...team.data() };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const createTeam = createAsyncThunk(
  'team/createTeamStatus',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const ref = db.collection('teams').doc();
      await db
        .collection('teams')
        .doc(id ? id : ref.id)
        .set(data);
      return {
        id: ref.id,
        ...data,
      };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const updateTeam = createAsyncThunk(
  'team/updateTeamStatus',
  async ({ id, data }: any, { getState, dispatch, rejectWithValue }) => {
    const state: any = getState();
    try {
      await db.collection('teams').doc(id).update(data);
      const userTeams = state.auth.user.teams.map((team) => ({
        id: team.id,
        name: team.name,
        role: team.role,
      }));
      const userTeamIndex = state.auth.user.teams.findIndex(
        (team) => team.id === id
      );
      userTeams[userTeamIndex].name = data.name;
      await db
        .collection('users')
        .doc(state.auth.user.uid)
        .update({ teams: userTeams });

      dispatch(updateUserTeam({ id, name: data.name }));

      return {
        ...state.team.data,
        ...data,
      };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const createTeamMember = createAsyncThunk(
  'createTeamMember',
  async ({ teamId, data }: any, { rejectWithValue }) => {
    try {
      await db
        .collection('teams')
        .doc(teamId)
        .update({
          users: _db.FieldValue.arrayUnion(data),
        });

      return data;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteTeamMember = createAsyncThunk(
  'deleteTeamMember',
  async ({ teamId, member }: any, { getState, rejectWithValue }) => {
    const state: any = getState();

    try {
      const updatedTeamMembers = state.team.data.users.filter(
        (user) => user.email !== member.email
      );
      const updatedTeam = {
        name: state.team.data.name,
        ownerId: state.team.data.ownerId,
        users: updatedTeamMembers,
      };

      await db.collection('teams').doc(teamId).update(updatedTeam);

      if (member.status === 'active') {
        const memberTeams = (
          await db.collection('users').doc(member.uid).get()
        ).data().teams;
        const newMemberTeams = memberTeams.filter(
          (memberTeam) => memberTeam.id !== teamId
        );

        await db
          .collection('users')
          .doc(member.uid)
          .update({ teams: newMemberTeams });
      }

      return {
        id: teamId,
        ...updatedTeam,
      };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const teamSlice = createSlice({
  name: 'team',
  initialState: {
    data: null,
    loading: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeam.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(updateTeam.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });

    builder.addCase(createTeamMember.fulfilled, (state, action) => {
      state.data.users.push(action.payload);
    });
    builder.addCase(deleteTeamMember.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default teamSlice.reducer;
