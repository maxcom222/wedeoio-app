import { User } from 'interfaces/user';

export const getPlan = async (user: User): Promise<string> => {
  if (user?.isPro) return 'Pro';
  if (user?.isHobby) return 'Hobby';
  return 'Free';
};
