
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
  areaStats: {
    crimeRate: string;
    transportScore: string;
    walkability: string;
    propertyGrowth: {
      flats: string;
      houses: string;
    };
    areaVibe: string[];
  };
}

export async function analyzeAreaPreferences(
  userInput: string,
  apiKey: string
): Promise<AreaMatch[] | null> {
  try {
    const prompt = `
You are an AI assistant for PoshMaps, a service that helps people find neighborhoods in London that match their preferences.

Based on the following user input, identify up to 10 areas in London that best match their preferences.
Ensure good geographical distribution across ALL of London (North, South, East, West, Central).
Do not bias towards South London. Make sure to include areas from North, East, and West London.
Only include areas within London, UK.

User input: "${userInput}"

For each area, provide:
1. Area name
2. Match percentage (between 70-98%)
3. A brief description of the area (2-3 sentences)
4. A "Posh Score" between 60-95
5. Coordinates (latitude and longitude) within London
6. A list of 3-7 amenities or features that match the user's request
7. Detailed area statistics including:
   - Crime rate (Low/Medium/High with specific percentage compared to London average, e.g., "Low - 15% below London average" or "Medium - 5% above London average")
   - Transport score (Poor/Good/Excellent with specific tube/train lines and time to central London, e.g., "Excellent - 20 min to central via Northern Line")
   - Walkability score (Not walkable/Moderately walkable/Very walkable with score out of 100)
   - Property growth (use "+" or "-" followed by percentage for clear growth indicators, e.g., "+3.5%" or "-1.2%")
   - Area vibe (2-4 tags like: Family-friendly, Upscale, Riverside, Trendy, Historic, etc.)

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
    "amenities": ["amenity1", "amenity2", "amenity3"],
    "areaStats": {
      "crimeRate": "Low - 20% below London average",
      "transportScore": "Excellent - 15 min to central via Northern Line",
      "walkability": "Very Walkable - 85/100",
      "propertyGrowth": {
        "flats": "+2.5%",
        "houses": "+3%"
      },
      "areaVibe": ["Family-friendly", "Upscale", "Riverside"]
    }
  }
]

IMPORTANT: Limit your response to a maximum of 10 areas. Ensure all areas are real London neighborhoods with accurate information and actual London coordinates. 
Sort by match percentage in descending order. Make sure to include areas from all regions of London (North, South, East, West, Central).
PROVIDE OUTPUT IN JSON FORMAT ONLY.
    `;

    console.log("Making request to OpenAI API with GPT-4o model");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o model for better results
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
    console.log("Received response from OpenAI:", jsonContent);
    const areas = JSON.parse(jsonContent) as AreaMatch[];
    
    // Limit to maximum 10 areas
    return areas.slice(0, 10);

  } catch (error) {
    console.error('Error analyzing area preferences:', error);
    toast.error(`AI processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
