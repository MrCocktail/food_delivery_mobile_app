import { CreateUserParams, SignInParams, GetMenuParams, Category } from "@/type";
import {
  Account,
  Avatars,
  Client,
  TablesDB,
  ID,
  Query,
  Storage
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.dave.foodordering",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  usersTableId: process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID!,
  categoriesTableId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID!,
  menuTableId: process.env.EXPO_PUBLIC_APPWRITE_MENU_TABLE_ID!,
  customizationTableId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_TABLE_ID!,
  menuCustomizationTableId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_TABLE_ID!,
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client)
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

export const getMenu = async ({ category, query } : GetMenuParams) => {
  try {
    const queries: string[] = []

    if (category) {
      queries.push(Query.equal("categories", category))
    }

    if (query) {
      queries.push(Query.search("name", query))
    }
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuTableId,
      queries: queries,
    });

    return result.rows
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId,
    }); 

    return result.rows as unknown as Category[]
  } catch (error) {
    throw new Error((error as Error).message);
  }
}