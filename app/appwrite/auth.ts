import { ID, OAuthProvider, Query } from 'appwrite';
import { account, appwriteConfig, database } from '~/appwrite/client';
import { redirect } from 'react-router';

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', id)]
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    console.log('Storing user data...');
    const user = await account.get();
    console.log('Fetched user from account.get():', user);
    if (!user) throw new Error('User not found');

    const { providerAccessToken } = (await account.getSession('current')) || {};
    console.log('Provider access token:', providerAccessToken);
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    console.log('Profile picture URL:', profilePicture);

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );
    console.log('Created user document:', createdUser);

    if (!createdUser.$id) redirect('/sign-in');
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=photos',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) throw new Error('Failed to fetch Google profile picture');

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error('Error fetching Google picture:', error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error('Error during OAuth2 session creation:', error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect('/sign-in');

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('accountId', user.$id),
        Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId']),
      ]
    );

    return documents.length > 0 ? documents[0] : redirect('/sign-in');
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
