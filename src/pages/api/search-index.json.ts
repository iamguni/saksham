import { getCollection } from 'astro:content';

export async function GET() {
  // ⚡ Fetch all site content streams in parallel
  const [projects, activities, leaders] = await Promise.all([
    getCollection('projects'),
    getCollection('activities'),
    getCollection('leaders')
  ]);

  // 1. Map Project entries
  const projectItems = projects.map(item => ({
    title: item.data.title || 'Project Initiative',
    summary: item.data.summary || '',
    description: item.data.description || '',
    url: `/projects/${item.data.slug}`,
    type: 'Project Initiative'
  }));

  // 2. Map Activity & Drive entries
  const activityItems = activities.map(item => ({
    title: item.data.title || 'Activity Event',
    summary: item.data.summary || '',
    description: item.data.description || '',
    url: `/activities/${item.data.slug}`,
    type: 'Activity Event'
  }));

  // 3. ⚡ Map Leader Profile entries (indexing names, roles, and bios)
  const leaderItems = leaders.map(item => ({
    title: item.data.name || 'Team Leader',
    summary: item.data.role || 'Core Member',
    description: `${item.data.bio || ''} ${item.data.quote || ''}`,
    url: '/', // Redirects visitors straight to the Team/About layout deck
    type: 'Leadership Team'
  }));

  // 4. Combine all components into a single global index matrix
  const masterIndex = [...projectItems, ...activityItems, ...leaderItems];

  return new Response(JSON.stringify(masterIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Caches the file in the browser for performance
    }
  });
}