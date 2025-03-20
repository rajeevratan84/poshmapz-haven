
import { toast } from 'sonner';

// Define interfaces for the OpenAI API response
interface AreaMatch {
  name: string;
  matchPercentage: number;
  description: string;
  poshScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
}

export async function analyzeAreaPreferences(
  userInput: string,
  apiKey: string
): Promise<AreaMatch[] | null> {
  try {
    const prompt = `
You are an AI assistant for PoshMaps, a service that helps people find neighborhoods in London that match their preferences.

Based on the following user input, identify up to 5 areas in London that best match their preferences.
Only include areas within London, UK.

User input: "${userInput}"

For each area, provide:
1. Area name
2. Match percentage (between 70-98%)
3. A brief description of the area (2-3 sentences)
4. A "Posh Score" between 60-95
5. Coordinates (latitude and longitude) within London
6. A list of 3-7 amenities or features that match the user's request

Format the response as a valid JSON array with objects having these exact keys:
[
  {
    "name": "Area Name",
    "matchPercentage": 95,
    "description": "Brief description of the area.",
    "poshScore": 85,
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    },
    "amenities": ["amenity1", "amenity2", "amenity3"]
  }
]

Ensure all areas are real London neighborhoods with accurate information and actual London coordinates. Sort by match percentage in descending order. PROVIDE OUTPUT IN JSON FORMAT ONLY.
    `;

    // Make request to OpenAI API - Let's switch to mock data for now until we get a valid API key
    // This will ensure the application works while the API key issue is resolved
    
    // Return mock data to demonstrate functionality
    const mockData: AreaMatch[] = [
      {
        name: "Hampstead",
        matchPercentage: 97,
        description: "An affluent area known for its intellectual, liberal, artistic, musical and literary associations. Hampstead Heath is one of London's most popular open spaces.",
        poshScore: 92,
        coordinates: {
          lat: 51.5559,
          lng: -0.1762
        },
        amenities: ["Hampstead Heath", "Kenwood House", "Flask Walk", "Hampstead Ponds", "Boutique shops", "Historic pubs"]
      },
      {
        name: "Richmond",
        matchPercentage: 95,
        description: "A leafy, affluent suburb with Richmond Park, the largest Royal Park in London. Known for its beautiful riverside location and village-like atmosphere.",
        poshScore: 89,
        coordinates: {
          lat: 51.4613,
          lng: -0.3037
        },
        amenities: ["Richmond Park", "Thames riverside walks", "Richmond Green", "Kew Gardens nearby", "Upscale dining", "Boutique shopping"]
      },
      {
        name: "Greenwich",
        matchPercentage: 89,
        description: "Home to the large and beautiful Greenwich Park. Known for its maritime history, cultural attractions and world heritage status.",
        poshScore: 78,
        coordinates: {
          lat: 51.4826,
          lng: 0.0077
        },
        amenities: ["Greenwich Park", "Royal Observatory", "Cutty Sark", "Greenwich Market", "Maritime Museum", "Riverside pubs"]
      },
      {
        name: "Regent's Park",
        matchPercentage: 87,
        description: "An elegant residential area surrounding one of London's most beautiful royal parks. Home to London Zoo and Regent's University.",
        poshScore: 85,
        coordinates: {
          lat: 51.5313,
          lng: -0.1570
        },
        amenities: ["Regent's Park", "Queen Mary's Gardens", "London Zoo", "Open Air Theatre", "Boating lake", "Sports facilities"]
      },
      {
        name: "Battersea",
        matchPercentage: 83,
        description: "A riverside district featuring the popular Battersea Park. Recently revitalized with upscale developments including the redeveloped Battersea Power Station.",
        poshScore: 76,
        coordinates: {
          lat: 51.4791,
          lng: -0.1465
        },
        amenities: ["Battersea Park", "Peace Pagoda", "Battersea Power Station", "Children's Zoo", "River Thames views", "Trendy restaurants"]
      }
    ];

    // Uncomment this section when you have a valid API key
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the latest model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides information about London neighborhoods in JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Extract JSON from the response (handling case where it might include markdown code blocks)
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    // Parse the JSON response
    const areas = JSON.parse(jsonContent) as AreaMatch[];
    return areas;
    */

    // Return the mock data for now
    console.log("Using mock data for London areas while API key issue is resolved");
    return mockData;

  } catch (error) {
    console.error('Error analyzing area preferences:', error);
    toast.error(`AI processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
