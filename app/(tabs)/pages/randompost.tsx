import {storage} from '../auth/login'
import database from '../db';
import Posting from '../model/Posting';

const categories = [
    { category: "Cleaning & House Keeping", subcategory: "Cooking" },
    { category: "Renovation & Construction", subcategory: "Windows" },
    { category: "Electrical", subcategory: "Wiring" },
    { category: "Computer & Electronics", subcategory: "Computer" },
    { category: "Design", subcategory: "House Plan" }
  ];
  
  const addresses = [
    "Hahnenberg 77, 68169 Mühlhausen, Germany",
    "Berliner Straße 12, 10117 Berlin, Germany",
    "Hauptstraße 45, 80331 München, Germany",
    "Bahnhofstraße 23, 50667 Köln, Germany",
    "Goethestraße 30, 60313 Frankfurt, Germany"
  ];
  
  export const generateRandomPost = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    
    return {
      userid: storage.getString('user.id'),
      questions: {
        address: randomAddress,
        budget: (Math.floor(Math.random() * 500) + 50).toString(), // Budget between 50-550
        category: randomCategory.category,
        coordinates: {
          latitude: 48.0 + Math.random(), // Random lat in Germany range
          longitude: 9.0 + Math.random()  // Random lon in Germany range
        },
        date: new Date().toISOString().split('T')[0], // Today's date
        description: `Task ${Math.floor(Math.random() * 1000)}`,
        payment_method: Math.random() > 0.5 ? "direct_payment" : "bank_transfer",
        subcategory: randomCategory.subcategory,
        title: `${randomCategory.category} Task ${Math.floor(Math.random() * 1000)}`
      }
    };
  };
  
  export const createRandomPosts = async (count: number) => {
    const postingCollection = database.get<Posting>('posting');
    await database.write(async () => {
      for (let i = 0; i < count; i++) {
        let post = await postingCollection.create(post => {
          const newPost = generateRandomPost();
          post.userid = newPost.userid;
          post.questions = newPost.questions;
        });
        console.log(post)
      }
    });
  };
