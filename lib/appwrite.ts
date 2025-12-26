import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  TablesDB,
  ID,
  Query
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.dave.foodordering",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  usersTableId: process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID!,
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    // 1. Créer le compte Appwrite
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    // 2. Créer une session (méthode recommandée)
    await signIn({ email, password });

    // 3. Créer l’utilisateur dans la table users
    const newUser = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: ID.unique(),
      data: {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatars.getInitialsURL(name),
      },
    });

    return newUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


export const signIn = async ({ email, password }: SignInParams) => {
  try {
    return await account.createEmailPasswordSession(email, password);
    
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No user is currently logged in");
    }

    
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      queries: [
        Query.equal("accountId", currentAccount.$id),
      ],
    });

    if (!result.rows.length) {
      throw new Error("User data not found");
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
