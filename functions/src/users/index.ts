import * as functions from 'firebase-functions';
import regionalFunctions from '../regionalFunctions';
import { sendWelcomeEmail } from '../sendgrid';
import { db, storage } from '../config';
import sampleData from '../json/sample-data.json';
const path = require('path');

const bucket = storage.bucket();

export const onUserCreate = regionalFunctions.firestore
  .document('/users/{documentId}')
  .onCreate(async (snap) => {
    const user = snap.data();
    await sendWelcomeEmail(user);

    return { status: 'success' };
  });

export const onUserDelete = regionalFunctions.auth
  .user()
  .onDelete(async (user) => {
    const userData = (await db.collection('users').doc(user.uid).get()).data();

    await db.collection('users').doc(user.uid).delete();

    for await (const team of userData.teams) {
      if (team.role === 'owner') {
        await db.collection('teams').doc(team.id).delete();
      } else if (team.role === 'member') {
        const userTeam = (
          await db.collection('teams').doc(team.id).get()
        ).data();
        const index = userTeam.users.findIndex(
          (teamUser) => teamUser.uid === user.uid
        );
        userTeam.users[index] = {
          email: userTeam.users[index].email,
          invitedAt: userTeam.users[index].joinedAt,
          role: userTeam.users[index].role,
          token: null,
          status: 'invited',
        };

        await db.collection('teams').doc(team.id).set(userTeam);
      }
    }

    return true;
  });

export const generateUserSampleData = regionalFunctions.https.onCall(
  async ({ uid }, context) => {
    if (!context?.auth?.token?.email) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Must be logged with an email address'
      );
    }

    try {
      // get user info
      const user = (await db.collection('users').doc(uid).get()).data();
      const teamIndex = user.teams.findIndex((el) => el.role === 'owner');
      const teamId = user.teams[teamIndex].id;
      const members = [];
      members[0] = (
        await db
          .collection('users')
          .where('email', '==', 'wedeoio.demo.john@gmail.com')
          .get()
      ).docs[0];
      members[1] = (
        await db
          .collection('users')
          .where('email', '==', 'wedeoio.demo.jenny@gmail.com')
          .get()
      ).docs[0];

      // add demo members to a main team
      const team = (await db.collection('teams').doc(teamId).get()).data();
      team.users = team.users.concat(
        members.map((member) => ({
          uid: member.id,
          name: member.data().name,
          email: member.data().email,
          role: 'member',
          status: 'active',
          joinedAt: user.createdAt,
        }))
      );
      await db.collection('teams').doc(teamId).set(team);

      // add demo project to a main team
      const projectId = db.collection('projects').doc().id;
      await db.collection('projects').doc(projectId).set({
        name: 'Demo Project',
        teamId,
        createdAt: user.createdAt,
      });

      // add demo files and folders

      // add folder
      await db.collection('files').add({
        name: 'Sample Folder',
        teamId,
        projectId,
        parentId: '',
        type: 'folder',
        assetType: '',
        src: '',
        thumbnail: '',
        status: 'approved',
        uploader: {
          id: members[0].id,
          name: members[0].data().name,
        },
        storage: {
          sourceName: '',
          thumbnailName: '',
        },
        path: [],
        createdAt: user.createdAt,
      });

      // add youtube
      await db.collection('files').add({
        name: 'AMERICAN FOOTBALL VS SOCCER | The Ultimate Showdown',
        teamId,
        projectId,
        parentId: '',
        type: 'youtube',
        assetType: 'video',
        src: 'https://www.youtube.com/watch?v=AHVCARQxba4',
        width: '200',
        height: '113',
        thumbnail: 'https://i.ytimg.com/vi/AHVCARQxba4/mqdefault.jpg',
        status: 'approved',
        uploader: {
          id: members[0].id,
          name: members[0].data().name,
        },
        storage: {
          sourceName: '',
          thumbnailName: '',
        },
        path: [],
        createdAt: user.createdAt,
      });

      // add asset files
      const sampleFiles = [];
      sampleFiles.push(
        {
          name: 'image-sample.jpg',
          type: 'image',
          width: 3840,
          height: 2215,
        },
        {
          name: 'video-sample.mp4',
          type: 'video',
          width: 1920,
          height: 1080,
        }
      );

      for await (const sampleFile of sampleFiles) {
        const fileId = db.collection('files').doc().id;
        const demoFileName = path.basename(sampleFile.name);
        const demoFileNameNoExtension = path.parse(demoFileName).name;
        const demoFileExtension = path.parse(demoFileName).ext;
        const demoThumbnailName = `${demoFileNameNoExtension}_thumb.png`;

        const fileName = `${fileId}${demoFileExtension}`;
        const thumbnailName = `${fileId}_thumb.png`;

        await bucket
          .file(`sample_data/${demoFileName}`)
          .copy(`assets/${fileName}`);
        await bucket
          .file(`sample_data/${demoThumbnailName}`)
          .copy(`assets/${thumbnailName}`);

        const copiedFile = bucket.file(`assets/${fileName}`);
        await copiedFile.makePublic();

        const copiedThumb = bucket.file(`assets/${thumbnailName}`);
        await copiedThumb.makePublic();

        const copiedFileUrl = await copiedFile.publicUrl();
        const copiedThumbUrl = await copiedThumb.publicUrl();

        await db
          .collection('files')
          .doc(fileId)
          .set({
            name: demoFileName,
            teamId,
            projectId,
            parentId: '',
            type: 'file',
            assetType: sampleFile.type,
            src: copiedFileUrl,
            width: sampleFile.width,
            height: sampleFile.height,
            thumbnail: copiedThumbUrl,
            status: 'approved',
            uploader: {
              id: members[1].id,
              name: members[1].data().name,
            },
            storage: {
              sourceName: fileName,
              thumbnailName: thumbnailName,
            },
            path: [],
            createdAt: user.createdAt,
          });

        // add comments
        for await (const comment of sampleData.comments[sampleFile.type]) {
          await db.collection('comments').add({
            fileId,
            text: comment.text,
            annotation: comment.annotation,
            start: comment.start,
            end: comment.end,
            commenter: {
              name: user.name,
              uid: user.uid,
            },
            createdAt: user.createdAt,
            isComplete: false,
            followers: [],
            replies: [],
          });
        }
      }
    } catch (error) {
      console.log('!!!!!!!!!!!!!!!!!!', error);
    }
  }
);
