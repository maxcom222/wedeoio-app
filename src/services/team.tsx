import { auth, db } from 'config/firebase';
import { makeId } from 'utils/makeId';

export const createTeam = (data: { name: string }): Promise<any> => {
  const { name } = data;
  const id = makeId(name);
  const ownerId = auth.currentUser.uid;
  const users = [
    {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      role: 'owner',
      status: 'active',
      createdAt: Date.now(),
    },
  ];

  return db
    .collection('teams')
    .doc(id)
    .set({ id, name, ownerId, users }, { merge: true });
};

export const updateTeam = (id: string, data: any): Promise<any> => {
  return db.collection('teams').doc(id).update(data);
};

export const getTeam = (teamId: string): Promise<any> => {
  return db
    .collection('teams')
    .doc(teamId)
    .get()
    .then((doc) => doc.data());
};

export const getTeamName = (teamId: string): Promise<any> => {
  return db
    .collection('teams')
    .doc(teamId)
    .get()
    .then((doc) => doc.data()?.name);
};

/**
 * isSlugAvailable checks if a team already has the given slug
 */
export const isSlugAvailable = async (slug: string): Promise<boolean> => {
  const teams = await db.collection('teams').where('slug', '==', slug).get();
  return teams.empty;
};
