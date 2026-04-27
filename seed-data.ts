
/**
 * Seed Data Script
 * Populates initial audio content for Indian languages
 */

import { ContentService } from './src/services/content.service';
import { AudioContent } from './src/models/AudioContent';

const contentService = new ContentService();

const seedData: Omit<AudioContent, 'id'>[] = [
  {
    title: "Mere Rashke Qamar",
    description: "A beautiful romantic song from the movie Baadshaho, sung by Rahat Fateh Ali Khan",
    language: "Hindi",
    category: "Music",
    duration: 285, // 4 minutes 45 seconds
    fileUrl: "http://localhost:3000/uploads/audio/mere-rashke-qamar.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/mere-rashke-qamar.jpg",
    isPremium: false,
    artist: "Rahat Fateh Ali Khan",
    tags: ["bollywood", "romantic", "sad", "2017"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Vaaji Vaaji",
    description: "Energetic Lavani dance number from the Marathi film Sairat",
    language: "Marathi",
    category: "Music",
    duration: 210, // 3 minutes 30 seconds
    fileUrl: "http://localhost:3000/uploads/audio/vaiji-vaiji.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/vaiji-vaiji.jpg",
    isPremium: false,
    artist: "Ajay-Atul",
    tags: ["marathi", "lavani", "dance", "sairat", "2016"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Tumi Je Amar",
    description: "Soulful Bengali Rabindra Sangeet interpretation",
    language: "Bengali",
    category: "Music",
    duration: 320, // 5 minutes 20 seconds
    fileUrl: "http://localhost:3000/uploads/audio/tumi-je-amar.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/tumi-je-amar.jpg",
    isPremium: true,
    artist: "Shreya Ghoshal",
    tags: ["bengali", "rabindra-sangeet", "classical", "devotional"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Kannum Kannum",
    description: "Melodious Tamil romantic track from the movie Vinnaithaandi Varuvaayaa",
    language: "Tamil",
    category: "Music",
    duration: 265, // 4 minutes 25 seconds
    fileUrl: "http://localhost:3000/uploads/audio/kannum-kannum.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/kannum-kannum.jpg",
    isPremium: false,
    artist: "A.R. Rahman",
    tags: ["tamil", "romantic", "rahman", "vinnaithaandi", "2010"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Podhigai",
    description: "Inspirational Tamil instrumental piece",
    language: "Tamil",
    category: "Instrumental",
    duration: 180, // 3 minutes
    fileUrl: "http://localhost:3000/uploads/audio/podhigai.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/podhigai.jpg",
    isPremium: true,
    artist: "Ilaiyaraaja",
    tags: ["tamil", "instrumental", "inspirational", "ilaiyaraaja"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Bengali Folk Collection",
    description: "Collection of traditional Bengali folk songs",
    language: "Bengali",
    category: "Folk",
    duration: 1800, // 30 minutes
    fileUrl: "http://localhost:3000/uploads/audio/bengali-folk-collection.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/bengali-folk-collection.jpg",
    isPremium: true,
    artist: "Various Artists",
    tags: ["bengali", "folk", "traditional", "collection"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Marathi Powada",
    description: "Traditional Marathi ballad describing heroic deeds",
    language: "Marathi",
    category: "Folk",
    duration: 240, // 4 minutes
    fileUrl: "http://localhost:3000/uploads/audio/marathi-powada.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/marathi-powada.jpg",
    isPremium: false,
    artist: "Shahir Sable",
    tags: ["marathi", "powada", "folk", "traditional", "ballad"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Hindi Ghazal Selection",
    description: "Classic Hindi ghazals by legendary singers",
    language: "Hindi",
    category: "Ghazal",
    duration: 2100, // 35 minutes
    fileUrl: "http://localhost:3000/uploads/audio/hindi-ghazal-selection.mp3",
    thumbnailUrl: "http://localhost:3000/uploads/thumbnails/hindi-ghazal-selection.jpg",
    isPremium: true,
    artist: "Jagjit Singh",
    tags: ["hindi", "ghazal", "classic", "jagjit-singh"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Populate seed data
console.log('🌱 Seeding database with initial content...');

seedData.forEach((item, index) => {
  try {
    const content = contentService.create(item);
    console.log(`✅ Created content ${index + 1}/${seedData.length}: ${content.title}`);
  } catch (error) {
    console.error(`❌ Failed to create content ${index + 1}:`, error);
  }
});

console.log(`🎉 Seeding complete! Added ${seedData.length} items to the database.`);
