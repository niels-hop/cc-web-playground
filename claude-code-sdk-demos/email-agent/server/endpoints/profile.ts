const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handleProfileEndpoint(req: Request): Promise<Response> {
  try {
    const profilePath = './agent/data/PROFILE.md';
    const profileFile = Bun.file(profilePath);

    if (await profileFile.exists()) {
      const content = await profileFile.text();
      return new Response(JSON.stringify({ content }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else {
      return new Response(JSON.stringify({ content: '' }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    console.error('Error reading profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to read profile' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}