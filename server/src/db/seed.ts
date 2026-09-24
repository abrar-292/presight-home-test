import { db, initializeDatabase } from './database';

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
  'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Mila', 'Aiden', 'Ella', 'Jackson',
  'Avery', 'David', 'Sofia', 'Joseph', 'Camila', 'Carter', 'Aria', 'Owen', 'Scarlett', 'Wyatt',
  'Victoria', 'John', 'Madison', 'Jack', 'Luna', 'Luke', 'Grace', 'Jayden', 'Chloe', 'Dylan',
  'Penelope', 'Grayson', 'Layla', 'Levi', 'Riley', 'Isaac', 'Zoey', 'Gabriel', 'Nora', 'Julian',
  'Lily', 'Mateo', 'Eleanor', 'Anthony', 'Hannah', 'Jaxon', 'Lillian', 'Lincoln', 'Addison', 'Joshua',
  'Aubrey', 'Christopher', 'Ellie', 'Andrew', 'Stella', 'Theodore', 'Natalie', 'Caleb', 'Zoe', 'Ryan',
  'Leah', 'Asher', 'Hazel', 'Nathan', 'Violet', 'Thomas', 'Aurora', 'Leo', 'Savannah', 'Isaiah',
  'Audrey', 'Charles', 'Brooklyn', 'Josiah', 'Bella', 'Hudson', 'Claire', 'Christian', 'Skylar', 'Hunter',
  'Yuki', 'Kenji', 'Sakura', 'Haruki', 'Aoi', 'Ren', 'Hina', 'Daiki', 'Mei', 'Hiroshi',
  'Carlos', 'Mateo', 'Santiago', 'Sofia', 'Valentina', 'Diego', 'Camila', 'Alejandro', 'Lucia', 'Javier',
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Angel', 'Isha', 'Myra',
  'Lukas', 'Maximilian', 'Jakob', 'Felix', 'Jonas', 'Paul', 'Leon', 'Finn', 'Noah', 'Elias',
  'Sophie', 'Marie', 'Maria', 'Mia', 'Emma', 'Hannah', 'Anna', 'Emilia', 'Johanna', 'Lea',
  'Pierre', 'Louis', 'Gabriel', 'Arthur', 'Jules', 'Hugo', 'Lucas', 'Leo', 'Adam', 'Paul',
  'Jade', 'Louise', 'Emma', 'Alice', 'Chloe', 'Lina', 'Lea', 'Rose', 'Mila', 'Ambre',
  'Ahmed', 'Omar', 'Ali', 'Zaid', 'Tariq', 'Fatima', 'Maryam', 'Noor', 'Layla', 'Salma'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
  'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Dubois', 'Laurent', 'Moreau', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand',
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Chopra', 'Kapoor', 'Mehta', 'Reddy', 'Nair',
  'Al-Mansoor', 'Al-Hashimi', 'Al-Sayed', 'Al-Kaabi', 'Al-Nuaimi', 'Al-Zaabi', 'Al-Suwaidi', 'Al-Marzooqi'
];

const NATIONALITIES = [
  'American', 'British', 'Canadian', 'German', 'French',
  'Japanese', 'Australian', 'Brazilian', 'Italian', 'Spanish',
  'Indian', 'Chinese', 'Dutch', 'Swedish', 'Swiss',
  'South Korean', 'Mexican', 'Norwegian', 'Portuguese', 'Irish',
  'New Zealander', 'Singaporean', 'South African', 'Danish', 'Polish',
  'Greek', 'Finnish', 'Austrian', 'Belgian', 'Argentinian',
  'Chilean', 'Turkish', 'Egyptian', 'Emirati', 'Saudi'
];

const HOBBIES = [
  'Photography', 'Hiking', 'Gaming', 'Cooking', 'Gardening',
  'Painting', 'Cycling', 'Running', 'Reading', 'Chess',
  'Yoga', 'Traveling', 'Surfing', 'Scuba Diving', 'Writing',
  'Pottery', 'Swimming', 'Rock Climbing', 'Astronomy', 'Bird Watching',
  'Baking', 'Woodworking', 'Martial Arts', 'Knitting', 'Drawing',
  'Dancing', 'Skateboarding', 'Fishing', 'Calligraphy', 'Archery',
  'Bouldering', 'Camping', 'Skiing', 'Snowboarding', 'Origami',
  'Board Games', 'Magic', 'Bartending', 'Robotics', '3D Printing',
  'Sailing', 'Kayaking', 'Music Production', 'Guitar', 'Piano',
  'Tennis', 'Badminton', 'Table Tennis', 'Volleyball', 'Meditation',
  'Sculpting', 'Stargazing', 'Geocaching', 'Podcast Hosting', 'Calligraphy'
];

// Clean distinct list of hobbies
const UNIQUE_HOBBIES = Array.from(new Set(HOBBIES));

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function seedDatabase(userCount: number = 3000): void {
  console.log('--- Initializing database tables and indexes ---');
  initializeDatabase();

  console.log('--- Checking existing data ---');
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (existingUsers.count > 0) {
    console.log(`Database already has ${existingUsers.count} users. Clearing old data for fresh seed...`);
    db.exec('DELETE FROM user_hobbies; DELETE FROM users; DELETE FROM hobbies;');
  }

  console.log(`--- Seeding ${UNIQUE_HOBBIES.length} hobbies ---`);
  const insertHobby = db.prepare('INSERT INTO hobbies (name) VALUES (?)');
  const hobbyIds: number[] = [];

  const insertAllHobbies = db.transaction(() => {
    for (const hobby of UNIQUE_HOBBIES) {
      const result = insertHobby.run(hobby);
      hobbyIds.push(Number(result.lastInsertRowid));
    }
  });
  insertAllHobbies();

  console.log(`--- Seeding ${userCount} users with hobbies ---`);
  const insertUser = db.prepare(`
    INSERT INTO users (avatar, first_name, last_name, age, nationality)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertUserHobby = db.prepare(`
    INSERT INTO user_hobbies (user_id, hobby_id)
    VALUES (?, ?)
  `);

  const seedTransaction = db.transaction(() => {
    for (let i = 0; i < userCount; i++) {
      const firstName = FIRST_NAMES[getRandomInt(0, FIRST_NAMES.length - 1)];
      const lastName = LAST_NAMES[getRandomInt(0, LAST_NAMES.length - 1)];
      const age = getRandomInt(18, 75);
      const nationality = NATIONALITIES[getRandomInt(0, NATIONALITIES.length - 1)];
      
      // Deterministic realistic avatar URLs using Dicebear or Unsplash avatars
      const avatarIndex = (i % 99) + 1;
      const avatar = `https://randomuser.me/api/portraits/men/${avatarIndex}.jpg`;

      const userResult = insertUser.run(avatar, firstName, lastName, age, nationality);
      const userId = Number(userResult.lastInsertRowid);

      // Random 0 to 10 hobbies
      const numHobbies = getRandomInt(0, 10);
      if (numHobbies > 0) {
        const selectedHobbyIds = getRandomElements(hobbyIds, numHobbies);
        for (const hobbyId of selectedHobbyIds) {
          insertUserHobby.run(userId, hobbyId);
        }
      }
    }
  });

  seedTransaction();
  console.log(`Successfully seeded ${userCount} users and their hobbies!`);
}

// Auto-run if executed directly
if (require.main === module) {
  seedDatabase();
}
