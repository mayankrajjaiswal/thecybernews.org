import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  audience: z.array(z.string()).optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  readingTime: z.string().optional(),
  author: z.string().optional(),
  reviewer: z.string().optional(),
  lastUpdated: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  relatedTopics: z.array(z.string()).optional(), // links to dictionary slugs
  relatedTools: z.array(z.string()).optional(),  // links to toolbox paths
  relatedDownloads: z.array(z.string()).optional(), // links to downloads paths
});

const learnCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: baseSchema,
});

const scamsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/scams' }),
  schema: baseSchema.extend({
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    platform: z.string().optional(),
    country: z.string().optional(),
  }),
});

const dictionaryCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dictionary' }),
  schema: baseSchema.extend({
    analogy: z.string().optional(),
  }),
});

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: baseSchema.extend({
    impactLevel: z.enum(['Low', 'Medium', 'High']).optional(),
  }),
});

const resourcesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: baseSchema.extend({
    url: z.string().url(), // the official external link
    type: z.enum(['Government', 'Framework', 'Community', 'Corporate']),
  }),
});

export const collections = {
  learn: learnCollection,
  scams: scamsCollection,
  dictionary: dictionaryCollection,
  news: newsCollection,
  resources: resourcesCollection,
};
