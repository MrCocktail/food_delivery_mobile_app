import { ID } from "react-native-appwrite";
import { appwriteConfig, tablesDB as databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(TableId: string): Promise<void> {
    console.log(TableId);
    
    const list = await databases.listRows(
        appwriteConfig.databaseId,
        TableId
    );

    await Promise.all(
        list.rows.map((doc) =>
            databases.deleteRow(appwriteConfig.databaseId, TableId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUri: string) {
  const file = await storage.createFile(
    appwriteConfig.bucketId,
    ID.unique(),
    {
      uri: imageUri,
      name: `image-${Date.now()}.jpg`,
      type: "image/jpeg",
      size: 0
    }
  );

  return storage.getFileViewURL(
    appwriteConfig.bucketId,
    file.$id
  );
}


async function seed(): Promise<void> {
    console.log('seed step 1');
    
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesTableId);
    await clearAll(appwriteConfig.customizationTableId);
    await clearAll(appwriteConfig.menuTableId);
    await clearAll(appwriteConfig.menuCustomizationTableId);
    await clearStorage();
    
    console.log('seed step 2');
    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createRow(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesTableId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

            console.log('seed step 3');
    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createRow(
            appwriteConfig.databaseId,
            appwriteConfig.customizationTableId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        console.log('menu 1');
        
        const uploadedImage = await uploadImageToStorage(item.image_url);
        console.log('menu 2');

        const doc = await databases.createRow(
            appwriteConfig.databaseId,
            appwriteConfig.menuTableId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;
console.log('seed step 5');

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationTableId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;