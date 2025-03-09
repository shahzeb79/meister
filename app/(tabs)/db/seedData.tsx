import database from './index';
import Category from '../model/Category';
import SubCategory from '../model/Subcategory';
import Questions from '../model/Questions';

const seedData = async () => {
    const getRandomControlType = (): string => {
        const controlTypes = ['textarea', 'dropdown', 'checkbox'];
        const randomIndex = Math.floor(Math.random() * controlTypes.length);
        return controlTypes[randomIndex];
      };
    const jsonData = [
        {
            "name": "Renovation & Construction",
            "subcategories": [
                {
                    "name": "Plumbing Works",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the plumbing issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Ceilings",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the ceiling issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Floor",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the floor issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Tile Works",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the tile work needed", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Doors",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the door issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Windows",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the window issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Roof & Facade Works",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the roof or facade issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Insulation Works",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the insulation work needed", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Construction & Installation",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the construction or installation job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Heating, Water Supply, Sewerage",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the heating, water, or sewerage issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Electrical",
            "id": 2,
            "subcategories": [
                {
                    "name": "Security System",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the security system issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Electrical Installation",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the electrical installation issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Wiring",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the wiring issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Door Bells",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the doorbell issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Cleaning & House Keeping",
            "id": 3,
            "subcategories": [
                {
                    "name": "Regular Cleaning",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the cleaning job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Deep Cleaning",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the deep cleaning job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Windows Cleaning",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the window cleaning job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Garbage Removal",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the garbage removal job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Cooking",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the cooking job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Ironing Clothes",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the ironing job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Dry Cleaning",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the dry cleaning job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Garden Maintenance",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the garden maintenance job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Nursing & Babysitters",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the nursing or babysitting job", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Pets Care",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the pet care needed", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Computer & Electronics",
            "id": 4,
            "subcategories": [
                {
                    "name": "Computer",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the computer issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Mobile Phone",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the mobile phone issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Other Electronics",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the electronic issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Design",
            "id": 5,
            "subcategories": [
                {
                    "name": "House Plan",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the house plan needs", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Software Development",
            "id": 6,
            "subcategories": [
                {
                    "name": "App Development",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the app development task", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "General Software",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the software task", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Photos & Videos",
            "id": 7,
            "subcategories": [
                {
                    "name": "Editing",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the editing task", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Shooting",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the shooting task", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Legal & Accounting",
            "id": 8,
            "subcategories": [
                {
                    "name": "Lawyer Services",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the legal service needed", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Accountants",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the accounting service needed", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Tutor & Teaching",
            "id": 9,
            "subcategories": [
                {
                    "name": "Home Tutor",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the tutoring needs", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        },
        {
            "name": "Car Repair",
            "id": 10,
            "subcategories": [
                {
                    "name": "Electrical",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the electrical issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                },
                {
                    "name": "Mechanical",
                    "questions": [
                        { "id": "q1", "question": "Enter post title", "key": "title" },
                        { "id": "q2", "question": "Describe the mechanical issue", "key": "description" },
                        { "id": "q3", "question": "What is the urgency level?", "key": "urgency" }
                    ]
                }
            ]
        }
    ];
    

    for (const categoryData of jsonData) {
        const categoriesCollection = database.get<Category>('category');
        const subCategoriesCollection = database.get<SubCategory>('subcategory');
        const questions = database.get<Questions>('questions');

        await database.write(async () => {
            let categoryx = await categoriesCollection.create((category) => {
              category.name = categoryData.name;
            })
            console.log(categoryx.name)
            for (const subCategory of categoryData.subcategories) {
                const sub = await subCategoriesCollection.create(subcategory => {
                    subcategory.category_id.set(categoryx)
                    subcategory.name = subCategory.name
                  })
                  console.log(sub.name)
                  for (const question of subCategory.questions) {
                    console.log(question.question)
                    const que = await questions.create(questionX => {
                        questionX.subcategory_id.set(sub)
                        questionX.question = question.question
                        questionX.controltype = getRandomControlType()
                        questionX.key = question.key
                      })
                      
                }
            }
        });
    }
};

export default seedData;
