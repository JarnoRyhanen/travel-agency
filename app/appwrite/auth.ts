import { account, appwriteConfig, database } from '~/appwrite/client';
import { ID, OAuthProvider, Query } from 'appwrite';
import { redirect } from 'react-router';

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(OAuthProvider.Google);
  } catch (error) {
    console.error('Error logging in with Google:', error);
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
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const getGooglePicture = async () => {
  try {
    const session = await account.getSession('current');

    const oAuthToken = session.providerAccessToken;
    if (!oAuthToken) {
      console.error('No OAuth token found for the current session.');
      return null;
    }

    const response = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=photos',
      {
        headers: {
          authorization: `Bearer ${oAuthToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch profile photo from google api');
      return null;
    }

    const data = await response.json();

    const photoUrl =
      data.photos && data.photos.lenght > 0 ? data.photos[0].url : null;

    return photoUrl;
  } catch (error) {
    console.error('Error fetching google profile picture:', error);
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', user.$id)]
    );

    if (documents.length > 0) return documents[0];

    const imageUrl = await getGooglePicture();

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: imageUrl || '',
        joinedAt: new Date().toISOString(),
      }
    );

    return newUser;
  } catch (error) {
    console.error('Error storing user data', error);
  }
};

export const getExistingUser = async () => {
  try {
    const user = await account.get();

    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', user.$id)]
    );

    if (documents.length === 0) return null;
    return documents[0];
  } catch (error) {
    console.error('Error fetching existing user:', error);
  }
};
