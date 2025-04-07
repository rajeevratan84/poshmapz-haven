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
        temperature: 0.7, // Increased for more variety in responses
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
    
    // Limit to maximum 10 areas but ensure we keep at least 6 for variety
    return areas.slice(0, Math.max(areas.length, 6)).slice(0, 10);

  } catch (error) {
    console.error('Error analyzing area preferences:', error);
    toast.error(`AI processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

export async function getAreaDetails(
  postcodeOrArea: string,
  apiKey: string
): Promise<AreaMatch | null> {
  try {
    console.log(`Making request to OpenAI API for area details for: ${postcodeOrArea}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides detailed information about UK locations in JSON format only.'
          },
          {
            role: 'user',
            content: getPostcodeAreaPrompt(postcodeOrArea)
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

    // Extract JSON from the response
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    // Parse the JSON response
    console.log('Received area details from OpenAI:', jsonContent);
    const areaDetails = JSON.parse(jsonContent) as AreaMatch;
    
    return areaDetails;

  } catch (error) {
    console.error('Error getting area details:', error);
    toast.error(`AI processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

function getLondonPrompt(userInput: string): string {
  return `
You are an AI assistant for PoshMaps, a service that helps people find neighborhoods in London that match their preferences.

Based on the following user input, identify UP TO 10 AREAS across ALL of London that best match their preferences.
CRUCIAL: PROVIDE DIVERSE GEOGRAPHICAL COVERAGE - include at least 2 areas each from North, South, East, West, and maybe 1-2 from Central London.
Ensure you include lesser-known areas and neighborhoods, not just the famous ones.
Make your selection HIGHLY DIVERSE in terms of area types, sizes, and character.

User input: "${userInput}"

For each area, provide:
1. Area name
2. Match percentage (between 70-98%)
3. A brief description of the area (2-3 sentences)
4. A "Posh Score" between 60-95
5. Coordinates (latitude and longitude) within London - BE PRECISE WITH COORDINATES
6. A list of 3-7 amenities or features that match the user's request
7. Detailed area statistics including:
   - Crime rate (Low/Medium/High with specific percentage compared to London average)
   - Transport score (Poor/Good/Excellent with specific tube/train lines and time to central London)
   - Walkability score (Not walkable/Moderately walkable/Very walkable with score out of 100)
   - Property growth (use "+" or "-" followed by percentage for clear growth indicators)
   - Area vibe (2-4 tags that describe the area character)
8. At the end of each description, add ONE sentence explaining why this area specifically matches the user's requirements.

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

IMPORTANT REQUIREMENTS: 
1. Include up to 10 areas total
2. Ensure geographic diversity across London (North, South, East, West, Central)
3. Include lesser-known neighborhoods alongside famous ones
4. Provide realistic, accurate information and precise coordinates
5. Sort by match percentage in descending order
6. PROVIDE OUTPUT IN JSON FORMAT ONLY
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

function getPostcodeAreaPrompt(postcodeOrArea: string): string {
  return `
You are an AI assistant for PoshMaps, a service that helps people find information about specific areas or postcodes in the UK.

Based on the provided input "${postcodeOrArea}", which could be a UK postcode or area name, provide COMPREHENSIVE and DETAILED information about this specific location.

If this is a London area, provide extensive details about the neighborhood. If it's outside of London, provide information about the town, city, or village.

Return a SINGLE location object with the following structure:

{
  "name": "Full Location Name, Region",
  "matchPercentage": 100,
  "description": "Detailed 3-4 sentence description of the area, including its character and notable features.",
  "areaType": "Urban/Suburban/Rural/Village/etc.",
  "history": "2-3 sentences about the area's historical development.",
  "demographics": "Description of who typically lives in this area.",
  "attractions": "Notable attractions, landmarks, or amenities in the area.",
  "recentTrends": "Recent developments or trends in the property market or community.",
  "poshScore": 85, (a score between 60-95 indicating how upscale the area is)
  "gentrificationIndex": 70, (a score between 30-100 indicating the level of gentrification)
  "coordinates": {
    "lat": 51.5074,
    "lng": -0.1278
  },
  "propertyPrices": {
    "flatTwoBed": 450000,
    "houseThreeBed": 750000
  },
  "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"],
  "matchingAmenities": ["specific match 1", "specific match 2", "specific match 3"],
  "areaStats": {
    "crimeRate": "Low - 25% below UK average",
    "transportScore": "Excellent - Direct trains to London (25 min)",
    "walkability": "Very Walkable - 85/100",
    "propertyGrowth": {
      "flats": "+3.5%",
      "houses": "+4.2%"
    },
    "areaVibe": ["Historic", "Family-friendly", "Upscale"]
  },
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"]
}

IMPORTANT REQUIREMENTS:
1. Provide REALISTIC and ACCURATE information
2. Include PRECISE coordinates for the location
3. Be SPECIFIC about property prices based on current market trends
4. Include NUMERICAL values for all scores (poshScore, gentrificationIndex)
5. ALWAYS return valid, properly formatted JSON
6. DO NOT include any explanatory text outside of the JSON object
7. Ensure the response is a SINGLE location object, not an array
`;
