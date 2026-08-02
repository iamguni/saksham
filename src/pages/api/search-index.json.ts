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
    url: `/projects/${item.data.slug || item.id || ''}`,
    type: 'Project Initiative'
  }));

  // 2. Map Activity & Drive entries
  const activityItems = activities.map(item => ({
    title: item.data.title || 'Activity Event',
    summary: item.data.summary || '',
    description: item.data.description || '',
    url: `/activities/${item.data.slug || item.id || ''}`,
    type: 'Activity Event'
  }));

  // 3. ⚡ FIXED: Robust Leadership Mapping Matrix
  let leaderItems: any[] = [];

  // Check if your collection contains a single global data file (e.g., leaders.json with a leaders array)
  if (leaders.length === 1 && (leaders[0].data as any).leaders) {
    const rawLeaders = (leaders[0].data as any).leaders || [];
    leaderItems = rawLeaders.map((item: any) => ({
      title: item.name || 'Team Leader',
      summary: item.role || 'Core Member',
      description: `${item.bio || ''} ${item.message || ''} ${item.quote || ''}`.trim(),
      url: '/', // Redirects straight to the Team/About profile layout
      type: 'Leadership Team'
    }));
  } else {
    // Fallback if they are structured as multiple individual files per leader
    leaderItems = leaders.map(item => ({
      title: item.data.name || 'Team Leader',
      summary: item.data.role || 'Core Member',
      description: `${item.data.bio || ''} ${item.data.message || ''} ${item.data.quote || ''}`.trim(),
      url: '/about',
      type: 'Leadership Team'
    }));
  }

  // 4. Combine all components into a single global index matrix
  const masterIndex = [...projectItems, ...activityItems, ...leaderItems];

  return new Response(JSON.stringify(masterIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}