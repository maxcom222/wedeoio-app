import regionalFunctions from '../regionalFunctions';
import { db } from '../config';
import { nameToSlug, slugToId } from './helpers';

export const createTeam = async (user) => {
  const users = [
    {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: 'owner',
      status: 'active',
      joinedAt: Date.now(),
    },
  ];
  let slug = nameToSlug(user.name);

  const isAvailable = await isSlugAvailable(slug);
  if (!isAvailable) {
    slug = slugToId(slug);
  }

  const team = {
    slug,
    name: `${user.name}'s Team`,
    id: user.uid,
    ownerId: user.uid,
    users,
  };

  await db.collection('teams').doc(team.ownerId).set(team, { merge: true });
};

export const addTeamMember = async (user) => {
  const team = await getTeam(user.teamId);
  const index = team.users.findIndex((object) => object.email === user.email);

  // If the user can't join a team because their email is not present on the team members list
  // we fall back to creating a own team for the user
  if (index === -1) {
    return createTeam(user);
  }

  team.users[index] = {
    ...team.users[index],
    uid: user.uid,
    name: user.name,
    status: 'active',
    joinedAt: Date.now(),
  };

  await db.collection('teams').doc(user.teamId).update(team);
};

/**
 *  Use this function to read the team document from Firestore
 */
export const getTeam = async (uid: string): Promise<any> => {
  return await db
    .collection('teams')
    .doc(uid)
    .get()
    .then((doc) => doc.data());
};

/**
 * isSlugAvailable checks if a team already has the given slug
 */
export const isSlugAvailable = async (slug: string): Promise<boolean> => {
  const teams = await db.collection('teams').where('slug', '==', slug).get();
  return teams.empty;
};

/**
 * On create of a team save the team ID to the user document
 */
export const onTeamCreate = regionalFunctions.firestore
  .document('/teams/{documentId}')
  .onCreate((snap) => {
    // const teamId = snap.data().id;

    return;
  });

/**
 * onTeamUpdate we check if a team member has been removed from the team
 * If so, it will create an own team and update the given user's teamID.
 * It results in this removed user becoming a team owner of a new team.
 */
export const onTeamUpdate = regionalFunctions.firestore
  .document('teams/{teamId}')
  .onUpdate(async (change) => {
    return { status: 200 };

    const previousUsers = change.before.data().users;
    const previousUsersIds = previousUsers.map((user) => user.uid);
    const newUsers = change.after.data().users;
    const newUsersIds = newUsers.map((user) => user.uid);
    const removedUserId = previousUsersIds.find(
      (uid) => newUsersIds.indexOf(uid) === -1
    );
    const removedUser = previousUsers.find(
      (user) => user.uid === removedUserId
    );

    // If removedUser exists that means it's deleted from the team
    // and we create a new team for this user.
    if (removedUser?.uid) {
      await createTeam(removedUser);
    }

    return { status: 200 };
  });

export const onTeamDelete = regionalFunctions.firestore
  .document('teams/{teamId}')
  .onDelete(async (snap) => {
    const projects = (
      await db.collection('projects').where('teamId', '==', snap.id).get()
    ).docs;
    for await (const project of projects) {
      await db.collection('projects').doc(project.id).delete();
    }

    return true;
  });
