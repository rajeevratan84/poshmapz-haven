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

    console.log(`Making request to OpenAI API with GPT-4.1 model in ${mapMode} mode${nearestCity !== 'none' ? ` near ${nearestCity}` : ''}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Updated to GPT-4.1
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides information about UK locations in JSON format only. Focus on discovering hidden gems and lesser-known areas that match user preferences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9, // Increased for more creative and diverse responses
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
        model: 'gpt-4.1-2025-04-14', // Updated to GPT-4.1
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
You are an AI assistant for PoshMaps that specializes in discovering HIDDEN GEMS and LESSER-KNOWN neighborhoods in London.

Your mission: Find UP TO 10 DIVERSE London areas that match the user's preferences, with a STRONG EMPHASIS on discovering neighborhoods that are often overlooked but perfect matches.

CRITICAL REQUIREMENTS:
1. AVOID the obvious choices (Notting Hill, Chelsea, Camden, Clapham, etc.) UNLESS they are truly exceptional matches
2. PRIORITIZE lesser-known neighborhoods, emerging areas, quiet residential pockets, and hidden gems
3. Include areas from ALL compass directions: North, South, East, West, and maybe 1-2 from Central
4. Mix of established residential areas, up-and-coming districts, village-like pockets, and unique enclaves
5. Consider areas like: Dulwich Village, Blackheath, Rotherhithe, Walthamstow Village, Forest Hill, Crystal Palace, Bermondsey Street, London Fields, Stoke Newington, Putney Heath, Barnes, Bow, Limehouse, New Cross, Peckham Rye, Honor Oak, Herne Hill, etc.

User preferences: "${userInput}"

For each area, provide comprehensive details including:
- Unique selling points that make this area special and often overlooked
- Why locals love it but tourists don't know about it
- Specific streets, pubs, cafes, or spots that define the character
- Transportation reality (not just "good transport" - be specific about lines, journey times)
- Realistic property prices and recent market trends
- What type of person thrives in this area

Structure your response as a JSON array with these exact keys:
[
  {
    "name": "Unique Area Name",
    "matchPercentage": 85,
    "description": "3-4 sentences describing the area's hidden charm, local character, and why it's often overlooked. Include specific details about what makes it special - mention actual streets, landmarks, or local spots.",
    "poshScore": 75,
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    },
    "amenities": ["specific local amenities", "unique features", "hidden gems"],
    "areaStats": {
      "crimeRate": "Low - 15% below London average",
      "transportScore": "Good - Overground to Liverpool Street (22 min), limited evening buses",
      "walkability": "Very Walkable - 88/100",
      "propertyGrowth": {
        "flats": "+4.2%",
        "houses": "+5.8%"
      },
      "areaVibe": ["Hidden gem", "Village feel", "Artistic"]
    }
  }
]

IMPORTANT: 
- Focus on AUTHENTICITY over fame
- Include specific local details (street names, pub names, market days, etc.)
- Mention WHY each area is often overlooked but shouldn't be
- Sort by match percentage (highest first)
- Ensure geographic diversity across London
- AVOID tourist hotspots unless they're genuinely perfect matches
- JSON FORMAT ONLY - no explanatory text outside the JSON
`;
}

function getUKPrompt(userInput: string, nearestCity: string = 'none'): string {
  const citySpecificGuidance = nearestCity !== 'none' 
    ? `Focus on hidden gems within a 30-mile radius of ${nearestCity}. Include both overlooked parts of the city itself and charming surrounding towns, villages, and suburbs that locals know but outsiders don't.` 
    : `Discover hidden gems across the UK - focus on places that locals love but don't appear in typical "best places to live" lists.`;

  return `
You are an AI assistant for PoshMaps that specializes in discovering HIDDEN GEMS and OVERLOOKED locations across the UK.

Your mission: Find up to 10 UK locations (outside London) that match the user's preferences, with STRONG EMPHASIS on places that are genuinely special but often missed by mainstream property searches.

CRITICAL REQUIREMENTS:
1. AVOID the obvious choices (Bath, York, Edinburgh city center, etc.) UNLESS they are truly exceptional matches
2. PRIORITIZE: Historic market towns, coastal villages, cathedral cities' hidden quarters, former mill towns with character, university towns' residential areas, converted industrial areas, rural suburbs with character
3. ${citySpecificGuidance}
4. Include variety: seaside towns, market towns, suburban villages, historic quarters, converted industrial areas, university suburbs
5. Consider places like: Marlow, Lewes, Rye, Hebden Bridge, Totnes, Ludlow, Stamford, Whitstable's backstreets, Harrogate's quieter areas, etc.

User preferences: "${userInput}"

For each location, provide:
- Why this place is special but often overlooked
- Specific details about local character (market days, independent shops, local traditions)
- Transportation reality (exact train services, journey times, car access)
- What type of lifestyle this place offers
- Property market insights and value for money

Structure as JSON array:
[
  {
    "name": "Hidden Gem Town/Village, County",
    "matchPercentage": 88,
    "description": "3-4 sentences about why this place is special, what locals love about it, and why it's often missed. Include specific details about character, amenities, and lifestyle.",
    "poshScore": 78,
    "coordinates": {
      "lat": 51.7520,
      "lng": -1.2577
    },
    "amenities": ["specific local features", "unique selling points", "hidden treasures"],
    "areaStats": {
      "crimeRate": "Low - 25% below UK average",
      "transportScore": "Good - Direct trains to London (45 min), limited Sunday service",
      "walkability": "Very Walkable - 85/100",
      "propertyGrowth": {
        "flats": "+3.8%",
        "houses": "+4.5%"
      },
      "areaVibe": ["Historic", "Hidden gem", "Community-focused"]
    }
  }
]

IMPORTANT:
- Focus on AUTHENTICITY and local character over fame
- Include specific local knowledge (market days, festivals, local landmarks)
- Explain WHY each place is often overlooked
- Sort by match percentage
- Ensure variety in location types and regions
${nearestCity !== 'none' ? `- Focus on areas within approximately 30 miles of ${nearestCity}` : '- Include locations from different UK regions for diversity'}
- JSON FORMAT ONLY
`;
}

function getPostcodeAreaPrompt(postcodeOrArea: string): string {
  return `
You are an AI assistant for PoshMaps that provides detailed, authentic information about specific UK locations.

For the location "${postcodeOrArea}", provide comprehensive and REALISTIC information. If this is a well-known area, focus on lesser-known aspects and hidden characteristics that locals know but outsiders don't.

Focus on:
- Authentic local character and community feel
- Specific neighborhoods within the broader area
- Local knowledge (best streets, hidden spots, community hubs)
- Realistic property market data
- Transportation reality (not just "good transport" - be specific)
- What type of person actually lives there vs. the stereotype

Return a SINGLE detailed location object:

{
  "name": "Specific Area Name, Region",
  "matchPercentage": 100,
  "description": "4-5 sentences providing authentic insight into the area's real character, including both positives and any challenges. Mention specific streets, local spots, or community features that define the area.",
  "areaType": "Specific classification (e.g., 'Victorian suburb', 'converted docklands', 'market town center')",
  "history": "2-3 sentences about how the area developed its current character, including recent changes.",
  "demographics": "Realistic description of who actually lives there, including age ranges, professions, and lifestyle types.",
  "attractions": "Specific local attractions, including both obvious ones and hidden gems that locals know.",
  "recentTrends": "Current property market trends, new developments, or community changes affecting the area.",
  "poshScore": 75, (realistic score based on actual local perception, not just property prices)
  "gentrificationIndex": 65, (honest assessment of gentrification level and pace)
  "coordinates": {
    "lat": 51.5074,
    "lng": -0.1278
  },
  "propertyPrices": {
    "flatTwoBed": 485000, (realistic current market prices)
    "houseThreeBed": 675000
  },
  "amenities": ["specific local amenities", "community features", "transport links", "shopping areas", "green spaces"],
  "matchingAmenities": ["standout features", "unique selling points", "local specialties"],
  "areaStats": {
    "crimeRate": "Medium - 10% above UK average, mostly antisocial behavior",
    "transportScore": "Good - Northern Line (Zone 2), 18 min to Bank, limited night service",
    "walkability": "Very Walkable - 82/100, flat terrain, good pedestrian areas",
    "propertyGrowth": {
      "flats": "+2.8%",
      "houses": "+4.1%"
    },
    "areaVibe": ["Community-focused", "Family-friendly", "Quietly trendy"]
  },
  "pros": ["Specific advantage 1", "Specific advantage 2", "Specific advantage 3"],
  "cons": ["Realistic drawback 1", "Realistic drawback 2"]
}

IMPORTANT:
- Provide REALISTIC and HONEST assessment
- Include both positives and genuine drawbacks
- Use specific local knowledge and details
- Ensure property prices reflect current market reality
- Be precise about transportation options and limitations
- JSON FORMAT ONLY - no explanatory text
`;
