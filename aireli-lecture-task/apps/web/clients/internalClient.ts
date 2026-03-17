import { PlatformAccessToken, PlatformUserCreateInput, PlatformUser } from '@enterprise-commerce/core/platform/types';
import axios from 'axios';

const registerUser = async (input: PlatformUserCreateInput): Promise<Pick<PlatformUser, "id"> | undefined | null> => {
  try {
    const { data } = await axios.post<Pick<PlatformUser, "id">>('http://localhost:3001/register', input);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return null;
    }

    throw error;
  }
};

const loginUser = async (_input: PlatformUserCreateInput): Promise<PlatformAccessToken> => {
  throw new Error('internalClient.loginUser is not implemented yet.');
};

const getUser = async (accessToken: string): Promise<PlatformUser | undefined | null> => {
  try {
    if(accessToken != "") {
      const { data } = await axios.get('http://localhost:3001/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data.user;
    } else {
      return null
    }
  } catch (error) {
    console.error(error);
    // Handle error
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  getUser
};
