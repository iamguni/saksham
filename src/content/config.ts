import { z, defineCollection } from 'astro:content';

// 1. Projects individual collection structure
const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    featured_slider: z.boolean().default(false),
    image: z.string(),
    category: z.enum([
      "Livelihood & Women Employability", 
      "Relief & Community Care", 
      "Health & Dignity for All", 
      "Empowering Through Education"
    ]),
    date: z.string(),
    description: z.string(),
  }),
});

// 2. Activities individual collection structure
const activitiesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    image: z.string(),
    date: z.string(),
    description: z.string(),
  }),
});

// 3. New Dynamic Settings validation collection structure (handles standalone files)
const settingsCollection = defineCollection({
  type: 'data',
  schema: z.any() // Dynamic structure matching site.json and leaders.json object outputs
});

// Export all registered directory definitions safely
export const collections = {
  'projects': projectsCollection,
  'activities': activitiesCollection,
  'settings': settingsCollection, // Now Astro tracks your config folder error-free!
};