import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, _auth, db, functions } from 'config/firebase';
import { createTeam } from './teamSlice';

export const setUser = createAsyncThunk(
  'auth/setUserStatus',
  async (currentUser: any, { rejectWithValue }) => {
    try {
      const doc = await db.collection('users').doc(currentUser.uid).get();
      if (doc.exists) {
        const authUser: any = { ...currentUser, ...doc.data() };

        const teams = await Promise.all(
          authUser.teams.map(async (team) => {
            const projects = await (
              await db
                .collection('projects')
                .where('teamId', '==', team.id)
                .orderBy('createdAt')
                .get()
            ).docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            return { ...team, projects };
          })
        );

        return {
          name: authUser.name,
          email: authUser.email,
          isAdmin: authUser.isAdmin,
          uid: authUser.uid,
          createdAt: authUser.createdAt,
          teams: teams,
        };
      }
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/loginStatus',
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);

      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogleStatus',
  async ({ teamId, email }: any, { dispatch, rejectWithValue }) => {
    const googleProvider = new _auth.GoogleAuthProvider();

    try {
      const { user } = await auth.signInWithPopup(googleProvider);

      if (teamId && email !== user.email) {
        await dispatch(deleteUser());
        const error = new Error(
          'Please use your email where we sent the invatation to'
        );
        throw error;
      }

      const userRegisteredRef = db.collection('users').doc(user.uid);
      const userRegistered = await userRegisteredRef.get();

      if (userRegistered.exists) {
        return userRegistered.data();
      }

      const teamData = {
        name: user.displayName + "'s Team",
        ownerId: user.uid,
        users: [
          {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: 'owner',
            status: 'active',
            joinedAt: Date.now(),
          },
        ],
      };

      const teamRef = db.collection('teams').doc();
      await dispatch(createTeam({ id: teamRef.id, data: teamData }));

      const userTeamsData = [
        {
          id: teamRef.id,
          name: teamData.name,
          role: 'owner',
        },
      ];

      if (teamId) {
        const memberedTeam: any = (
          await (await db.collection('teams').doc(teamId)).get()
        ).data();

        userTeamsData.push({
          id: teamId,
          name: memberedTeam.name,
          role: 'member',
        });

        const index = memberedTeam.users.findIndex(
          (teamUser) => teamUser.email === email
        );
        if (index !== -1) {
          memberedTeam.users[index] = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: 'member',
            status: 'active',
            joinedAt: Date.now(),
          };
        } else {
          memberedTeam.users.push({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: 'member',
            status: 'active',
            joinedAt: Date.now(),
          });
        }

        await db.collection('teams').doc(teamId).update(memberedTeam);
      }

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        isAdmin: false,
        createdAt: Date.now(),
        teams: userTeamsData,
      });

      const GenerateUserSampleData = functions.httpsCallable(
        'generateUserSampleData'
      );
      await GenerateUserSampleData({ uid: user.uid });

      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logoutStatus',
  async (_: void, { rejectWithValue }) => {
    try {
      await auth.signOut();
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signupStatus',
  async (
    { email, name, password, teamId }: any,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      auth.currentUser.sendEmailVerification();

      const teamData = {
        name: name + "'s Team",
        ownerId: user.uid,
        users: [
          {
            uid: user.uid,
            name: name,
            email: email,
            role: 'owner',
            status: 'active',
            joinedAt: Date.now(),
          },
        ],
      };

      const teamRef = db.collection('teams').doc();
      await dispatch(createTeam({ id: teamRef.id, data: teamData }));

      const userTeamsData = [
        {
          id: teamRef.id,
          name: teamData.name,
          role: 'owner',
        },
      ];

      if (teamId) {
        const memberedTeam: any = (
          await (await db.collection('teams').doc(teamId)).get()
        ).data();

        userTeamsData.push({
          id: teamId,
          name: memberedTeam.name,
          role: 'member',
        });

        const index = memberedTeam.users.findIndex(
          (teamUser) => teamUser.email === email
        );
        memberedTeam.users[index] = {
          uid: user.uid,
          email: email,
          name: name,
          role: 'member',
          status: 'active',
          joinedAt: Date.now(),
        };

        await db.collection('teams').doc(teamId).update(memberedTeam);
      }

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: email,
        name: name,
        isAdmin: false,
        createdAt: Date.now(),
        teams: userTeamsData,
      });

      const GenerateUserSampleData = functions.httpsCallable(
        'generateUserSampleData'
      );
      await GenerateUserSampleData({ uid: user.uid });

      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const sendPasswordResetEmail = createAsyncThunk(
  'auth/sendPasswordResetEmail',
  async (email: any, { rejectWithValue }) => {
    try {
      const response = await auth.sendPasswordResetEmail(email);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUserStatus',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      await db.collection('users').doc(id).update(data);
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUserStatus',
  async (_: void, { rejectWithValue }) => {
    try {
      await auth.currentUser.delete();
      return null;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const join = createAsyncThunk(
  'auth/joinStatus',
  async ({ teamId, teamName, userId, email }: any, { rejectWithValue }) => {
    try {
      const user = (await db.collection('users').doc(userId).get()).data();
      user.teams.push({
        id: teamId,
        name: teamName,
        role: 'member',
      });
      await db.collection('users').doc(userId).set(user);

      const memberedTeam: any = (
        await (await db.collection('teams').doc(teamId)).get()
      ).data();

      const index = memberedTeam.users.findIndex(
        (teamUser) => teamUser.email === email
      );
      memberedTeam.users[index] = {
        uid: user.uid,
        email: email,
        name: user.name,
        role: 'member',
        status: 'active',
        joinedAt: Date.now(),
      };

      await db.collection('teams').doc(teamId).update(memberedTeam);
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,

    loading: null,
  },
  reducers: {
    updateUserTeam: (state, action) => {
      const teamIndex = state.user.teams.findIndex(
        (team) => team.id === action.payload.id
      );
      state.user.teams[teamIndex].name = action.payload.name;
    },

    addUserProject: (state, action) => {
      const teamIndex = state.user.teams.findIndex(
        (team) => team.id === action.payload.teamId
      );
      state.user.teams[teamIndex].projects.push(action.payload);
    },
    updateUserProject: (state, action) => {
      const teamIndex = state.user.teams.findIndex(
        (team) => team.id === action.payload.teamId
      );
      const projectIndex = state.user.teams[teamIndex].projects.findIndex(
        (project) => project.id === action.payload.id
      );
      state.user.teams[teamIndex].projects[projectIndex] = action.payload;
    },
    deleteUserProject: (state, action) => {
      const teamIndex = state.user.teams.findIndex(
        (team) => team.id === action.payload.teamId
      );
      state.user.teams[teamIndex].projects = state.user.teams[
        teamIndex
      ].projects.filter((project) => project.id !== action.payload.id);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(loginWithGoogle.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const {
  updateUserTeam,

  addUserProject,
  updateUserProject,
  deleteUserProject,
} = authSlice.actions;

export default authSlice.reducer;
