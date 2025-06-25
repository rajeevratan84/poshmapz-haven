
import { toast } from 'sonner';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  name?: string;
  type?: string;
}

export async function translateToOverpassQuery(
  userQuery: string,
  apiKey: string
): Promise<string | null> {
  try {
    console.log('Translating user query to Overpass API query:', userQuery);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert at converting simple place queries into Overpass API queries for OpenStreetMap data within London bounds.

CRITICAL REQUIREMENTS:
- Always use London bounding box: [bbox:51.28,-0.51,51.69,0.33]
- Only return the raw Overpass QL query, no explanations or markdown
- Focus on finding specific types of places/amenities
- Use appropriate OpenStreetMap tags for the requested places
- Always include coordinate output format: [out:json][timeout:25];
- End with: out geom;

Common place types and their tags:
- Coffee shops: amenity=cafe
- Restaurants: amenity=restaurant + cuisine tags
- Pubs/bars: amenity=pub or amenity=bar
- Shops: shop=* (specific shop types)
- Gyms: leisure=fitness_centre
- Pharmacies: amenity=pharmacy
- Bookstores: shop=books
- Banks: amenity=bank
- Hotels: tourism=hotel

Example query structure:
[out:json][timeout:25][bbox:51.28,-0.51,51.69,0.33];
(
  node[amenity=cafe];
  way[amenity=cafe];
  relation[amenity=cafe];
);
out geom;

Return ONLY the Overpass QL query.`
          },
          {
            role: 'user',
            content: `Find all "${userQuery}" in London`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const overpassQuery = data.choices[0]?.message?.content?.trim();
    
    if (!overpassQuery) {
      throw new Error('No query generated from OpenAI');
    }

    console.log('Generated Overpass query:', overpassQuery);
    return overpassQuery;

  } catch (error) {
    console.error('Error translating query:', error);
    toast.error(`AI translation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

export async function fetchOverpassData(overpassQuery: string): Promise<HeatmapPoint[]> {
  try {
    console.log('Fetching data from Overpass API...');
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Overpass data:', data);

    const points: HeatmapPoint[] = [];

    if (data.elements) {
      data.elements.forEach((element: any) => {
        let lat: number, lng: number;
        
        if (element.type === 'node' && element.lat && element.lon) {
          lat = element.lat;
          lng = element.lon;
        } else if (element.type === 'way' && element.center) {
          lat = element.center.lat;
          lng = element.center.lon;
        } else if (element.type === 'relation' && element.center) {
          lat = element.center.lat;
          lng = element.center.lon;
        } else {
          return; // Skip elements without coordinates
        }

        // Extract meaningful name and type
        const name = element.tags?.name || 
                    element.tags?.brand || 
                    element.tags?.amenity || 
                    element.tags?.shop || 
                    'Unknown';
        
        const type = element.tags?.amenity || 
                    element.tags?.shop || 
                    element.tags?.leisure || 
                    element.tags?.tourism || 
                    'poi';
        
        points.push({
          lat,
          lng,
          intensity: 1, // Base intensity for heatmap
          name,
          type
        });
      });
    }

    console.log(`Processed ${points.length} points from Overpass data`);
    return points;

  } catch (error) {
    console.error('Error fetching Overpass data:', error);
    toast.error(`Data fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}
