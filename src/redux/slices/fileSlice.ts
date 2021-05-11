import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db, storage } from 'config/firebase';

export const fetchFiles = createAsyncThunk(
  'file/fetchFilesStatus',
  async ({ files, folderId }: any, { rejectWithValue }) => {
    try {
      const currentFolder = folderId
        ? (await db.collection('files').doc(folderId).get()).data()
        : null;
      const currentFolderData = currentFolder
        ? { id: folderId, ...currentFolder }
        : null;

      return {
        files,
        currentFolderData,
      };
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const createFile = createAsyncThunk(
  'file/createFile',
  async (
    {
      type,
      name = '',
      link = '',
      thumbnail = '',
      assetType = '',

      uid = '',
      sourceName = '',
      thumbnailName = '',
      path = [],

      teamId,
      projectId,
      parentId,
    }: any,
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      let data;

      switch (type) {
        case 'folder':
          uid = db.collection('files').doc().id;
          data = {
            name,
            teamId,
            projectId,
            parentId,
            type,
            assetType,
            src: '',
            thumbnail: '',
            status: 'approved',
            uploader: {
              id: state.auth.user.uid,
              name: state.auth.user.name,
            },
            storage: {
              sourceName,
              thumbnailName,
            },
            path,
            createdAt: Date.now(),
          };

          await db.collection('files').doc(uid).set(data);

          break;

        case 'youtube':
          let ID = '';
          link = link
            .replace(/(>|<)/gi, '')
            .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
          if (link[2] !== undefined) {
            ID = link[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
          } else {
            ID = link;
          }

          const youtubeLink = `https://www.youtube.com/watch?v=${ID}`;
          const youtubeThumbnail = `https://i.ytimg.com/vi/${ID}/mqdefault.jpg`;
          const { width, height, title: youtubeTitle } = await (
            await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ID}&format=json`
            )
          ).json();

          uid = db.collection('files').doc().id;
          data = {
            name: youtubeTitle,
            teamId,
            projectId,
            parentId,
            type,
            assetType,
            src: youtubeLink,
            width,
            height,
            thumbnail: youtubeThumbnail,
            status: 'approved',
            uploader: {
              id: state.auth.user.uid,
              name: state.auth.user.name,
            },
            storage: {
              sourceName,
              thumbnailName,
            },
            path,
            createdAt: Date.now(),
          };

          await db.collection('files').doc(uid).set(data);

          break;

        case 'file':
          data = {
            name,
            teamId,
            projectId,
            parentId,
            type,
            assetType,
            src: link,
            thumbnail,
            status: 'approved',
            uploader: {
              id: state.auth.user.uid,
              name: state.auth.user.name,
            },
            storage: {
              sourceName,
              thumbnailName: `${uid}_thumb.png`,
            },
            path,
            createdAt: Date.now(),
          };

          await db.collection('files').doc(uid).set(data);
          break;

        default:
          break;
      }

      return;
    } catch (error) {
      console.log('error', error);
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file/deleteFileStatus',
  async (file: any, { rejectWithValue }) => {
    try {
      await db.collection('files').doc(file.id).delete();
      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const renameFile = createAsyncThunk(
  'file/renameFileStatus',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      await db.collection('files').doc(id).update(data);
      return;
    } catch (error) {
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const uploadFiles = createAsyncThunk(
  'file/uploadFilesStatus',
  async (
    { blobs, teamId, projectId, parentId }: any,
    { getState, dispatch, rejectWithValue }
  ) => {
    const state: any = getState();

    try {
      const uploadStates = blobs.map((blob, key) => ({
        id: state.file.uploadCount + key,
        name: blob.name,
        progress: 0,
      }));

      dispatch(addUploadStates(uploadStates));
      dispatch(increaseUploadCount(blobs.length));

      for (const key in blobs) {
        const blob = blobs[key];
        const uploadId = state.file.uploadCount + Number(key);

        const ref = db.collection('files').doc();
        const sourceName = `${ref.id}.${blob.name.split('.').pop()}`;
        const thumbnailName = '';
        await dispatch(
          createFile({
            type: 'file',
            assetType: blob.type.split('/')[0],
            name: blob.name,
            link: '',
            thumbnail: '',

            uid: ref.id,
            sourceName,
            thumbnailName,

            teamId,
            projectId,
            parentId,
          })
        );

        const uploadTask = storage.ref(`/assets/${sourceName}`).put(blob);

        const unsubscribe = uploadTask.on(
          'state_change',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            dispatch(updateUploadState({ id: uploadId, progress }));
          },
          (error) => {
            console.log('error', error);
          },
          () => {
            storage
              .ref('assets')
              .child(sourceName)
              .getDownloadURL()
              .then((firebaseUrl) => {
                dispatch(deleteUploadState(uploadId));
                unsubscribe();
                db.collection('files').doc(ref.id).update({ src: firebaseUrl });
              });
          }
        );
      }
    } catch (error) {
      console.log('error', error);
      if (!error.response) {
        throw error.message;
      }
      rejectWithValue(error.response.data);
    }
  }
);

export const fileSlice = createSlice({
  name: 'file',
  initialState: {
    data: null,
    loading: false,
    currentFolder: null,

    creating: false,
    renaming: false,
    deleting: false,

    uploads: [],
    uploadCount: 0,
  },
  reducers: {
    increaseUploadCount: (state, action) => {
      state.uploadCount = state.uploadCount + action.payload;
    },
    addUploadStates: (state, action) => {
      state.uploads.push(...action.payload);
    },
    updateUploadState: (state, action) => {
      const index = state.uploads.findIndex(
        (el) => el.id === action.payload.id
      );
      state.uploads[index].progress = action.payload.progress;
    },
    deleteUploadState: (state, action) => {
      state.uploads = state.uploads.filter((el) => el.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state) => {
      state.data = null;
      state.loading = true;
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.data = action.payload.files;
      state.currentFolder = action.payload.currentFolderData;
      state.loading = false;
    });

    builder.addCase(createFile.pending, (state) => {
      state.creating = true;
    });
    builder.addCase(createFile.fulfilled, (state) => {
      state.creating = false;
    });

    builder.addCase(deleteFile.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(deleteFile.fulfilled, (state) => {
      state.deleting = false;
    });

    builder.addCase(renameFile.pending, (state) => {
      state.renaming = true;
    });
    builder.addCase(renameFile.fulfilled, (state) => {
      state.renaming = false;
    });
  },
});

export const {
  addUploadStates,
  updateUploadState,
  deleteUploadState,
  increaseUploadCount,
} = fileSlice.actions;

export default fileSlice.reducer;
