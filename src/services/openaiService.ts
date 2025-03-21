
import { toast } from 'sonner';
import { AreaMatch } from '@/types/area';

export async function analyzeAreaPreferences(
  userInput: string,
  apiKey: string,
  mapMode: 'london' | 'uk' = 'london',
  nearestCity: string = 'none'
): Promise<AreaMatch[] | null> {
  try {
    // Choose the appropriate prompt based on the map mode
    const prompt = mapMode === 'london' 
      ? getLondonPrompt(userInput)
      : getUKPrompt(userInput, nearestCity);

    console.log(`Making request to OpenAI API with GPT-4o model in ${mapMode} mode${nearestCity !== 'none' ? ` near ${nearestCity}` : ''}`);
    
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
            content: 'You are a helpful assistant that provides information about UK locations in JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lowered from 0.7 to 0.3 for more consistent results
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
    console.log(`Received response from OpenAI for ${mapMode} mode:`, jsonContent);
    const areas = JSON.parse(jsonContent) as AreaMatch[];
    
    // Limit to maximum 10 areas
    return areas.slice(0, 10);

  } catch (error) {
    console.error('Error analyzing area preferences:', error);
    toast.error(`AI processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

function getLondonPrompt(userInput: string): string {
  return `
You are an AI assistant for PoshMaps, a service that helps people find neighborhoods in London that match their preferences.

Based on the following user input, identify up to 10 areas in London that best match their preferences.
Ensure good geographical distribution across ALL of London (North, South, East, West, Central).
Do not bias towards South London. Make sure to include areas from North, East, and West London.
Only include areas within London, UK.

IMPORTANT: Don't just include major areas - consider small neighborhoods, villages, and lesser-known areas within London that might be perfect matches.

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
8. At the end of each description, add ONE sentence explaining why this area specifically does or does not match the user's requirements.

Format the response as a valid JSON array with objects having these exact keys:
[
  {
    "name": "Area Name",
    "matchPercentage": 95,
    "description": "Brief description of the area. Also includes why it matches requirements.",
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
Include smaller, lesser-known neighborhoods that might be perfect matches, not just the obvious major areas.
PROVIDE OUTPUT IN JSON FORMAT ONLY.
  `;
}

function getUKPrompt(userInput: string, nearestCity: string = 'none'): string {
  const citySpecificGuidance = nearestCity !== 'none' 
    ? `Focus on areas within a 30-mile radius of ${nearestCity}. Include both the city itself and surrounding towns, villages, and suburbs that match the user's preferences.` 
    : `Ensure good geographical distribution across the UK (Scotland, Wales, Northern Ireland, and England regions).`;

  return `
You are an AI assistant for PoshMaps, a service that helps people find towns and cities in the United Kingdom that match their preferences.

Based on the following user input, identify up to 10 areas in the UK (outside of London) that best match their preferences.
${citySpecificGuidance}
Only include real cities, towns, villages and small communities within the United Kingdom, covering a range of sizes from small villages to major cities.
DO NOT include neighborhoods within London as they are handled separately.
IMPORTANT: DO NOT INCLUDE ANY LONDON AREAS IN YOUR RESULTS, EVEN IF THE USER MENTIONS LONDON.

IMPORTANT: Consider small villages, hamlets, and lesser-known communities that might be perfect matches, not just major towns and cities.

User input: "${userInput}"

For each location, provide:
1. Location name and region (e.g., "Edinburgh, Scotland" or "Manchester, England")
2. Match percentage (between 70-98%)
3. A brief description of the location (2-3 sentences)
4. A "Posh Score" between 60-95
5. Coordinates (latitude and longitude) for the location
6. A list of 3-7 amenities or features that match the user's request
7. Detailed area statistics including:
   - Crime rate (Low/Medium/High with specific percentage compared to UK average, e.g., "Low - 15% below UK average" or "Medium - 5% above UK average")
   - Transport score (Poor/Good/Excellent with specific details on train connections, airports, bus service, etc.)
   - Walkability score (Not walkable/Moderately walkable/Very walkable with score out of 100)
   - Property growth (use "+" or "-" followed by percentage for clear growth indicators, e.g., "+3.5%" or "-1.2%")
   - Area vibe (2-4 tags like: Coastal, University Town, Historic, Cultural, etc.)
8. At the end of each description, add ONE sentence explaining why this location specifically matches the user's requirements.

Format the response as a valid JSON array with objects having these exact keys:
[
  {
    "name": "Location Name, Region",
    "matchPercentage": 95,
    "description": "Brief description of the location. Also includes why it matches requirements.",
    "poshScore": 85,
    "coordinates": {
      "lat": 55.9533,
      "lng": -3.1883
    },
    "amenities": ["amenity1", "amenity2", "amenity3"],
    "areaStats": {
      "crimeRate": "Low - 20% below UK average",
      "transportScore": "Excellent - Direct trains to London (2.5 hours), International airport",
      "walkability": "Very Walkable - 85/100",
      "propertyGrowth": {
        "flats": "+2.5%",
        "houses": "+3%"
      },
      "areaVibe": ["Historic", "Cultural", "University Town"]
    }
  }
]

IMPORTANT: 
- Limit your response to a maximum of 10 locations
- Ensure all locations are real UK towns and cities with accurate information and actual UK coordinates
- Sort by match percentage in descending order
- DO NOT include any London areas in your results
- Make sure to consider small villages and lesser-known areas that might be perfect matches
${nearestCity !== 'none' ? `- Focus on areas within approximately 30 miles of ${nearestCity}` : '- Include locations from different regions of the UK for diversity'}
PROVIDE OUTPUT IN JSON FORMAT ONLY.
  `;
}
