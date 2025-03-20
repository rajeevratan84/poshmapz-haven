
import { toast } from 'sonner';
import { AreaMatch } from '@/types/area';

export async function analyzeAreaPreferences(
  userInput: string,
  apiKey: string,
  locationType: 'london' | 'world' = 'london',
  country?: string
): Promise<AreaMatch[] | null> {
  try {
    const locationSpecificInstructions = locationType === 'london' 
      ? `
Ensure good geographical distribution across ALL of London (North, South, East, West, Central).
Do not bias towards South London. Make sure to include areas from North, East, and West London.
Only include areas within London, UK.`
      : `
Ensure good geographical distribution across ${country || 'the selected country'}.
Include a mix of urban, suburban, and where appropriate, rural areas.
Consider popular areas for both locals and expatriates.
Make sure to include a range of neighborhood types from affordable to upscale.`;

    const prompt = `
You are an AI assistant for PoshMaps, a service that helps people find neighborhoods that match their preferences.

Based on the following user input, identify up to 10 areas in ${locationType === 'london' ? 'London' : country || 'the selected country'} that best match their preferences.
${locationSpecificInstructions}

User input: "${userInput}"

For each area, provide:
1. Area name
2. Match percentage (between 70-98%)
3. A brief description of the area (2-3 sentences)
4. A "Posh Score" between 60-95
5. Coordinates (latitude and longitude) within ${locationType === 'london' ? 'London' : country || 'the selected country'}
6. A list of 3-7 amenities or features that match the user's request
7. Detailed area statistics including:
   - Crime rate (Low/Medium/High with specific percentage compared to ${locationType === 'london' ? 'London' : 'national'} average, e.g., "Low - 15% below average" or "Medium - 5% above average")
   - Transport score (Poor/Good/Excellent with specific details like bus routes, train lines, etc.)
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
      "crimeRate": "Low - 20% below ${locationType === 'london' ? 'London' : 'national'} average",
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

IMPORTANT: Limit your response to a maximum of 10 areas. Ensure all areas are real ${locationType === 'london' ? 'London neighborhoods' : `locations in ${country || 'the selected country'}`} with accurate information and actual coordinates. 
Sort by match percentage in descending order.
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
            content: `You are a helpful assistant that provides information about ${locationType === 'london' ? 'London' : country || 'global'} neighborhoods in JSON format only.`
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
