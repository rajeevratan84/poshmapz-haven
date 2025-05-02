import OpenAI from 'openai';
import { AreaMatch } from '@/types/area';

const AREA_PROMPT = (area_description: string, location: string) => `I am looking for a place to live. Please analyze the following description of my ideal area: "${area_description}". Based on this, suggest some specific areas in ${location} that might be a good fit for me.

I want you to respond with a JSON array of objects. Each object should contain the following keys:
- name: The name of the area.
- matchPercentage: A number between 0 and 100 indicating how well the area matches my preferences.
- description: A short description of the area, highlighting why it might be a good fit for me.
- poshScore: A number between 0 and 100 indicating how "posh" the area is. This is subjective, but should be based on factors like property prices, local amenities, and the general reputation of the area.
- coordinates: An object containing the latitude and longitude of the area.
- amenities: An array of strings, each string being a specific reason why the area might be a good fit for me.
- areaStats: An object containing some statistics about the area, including:
  - crimeRate: A string describing the crime rate in the area (e.g. "low", "moderate", "high").
  - transportScore: A string describing the public transport options in the area (e.g. "excellent", "good", "poor").
  - walkability: A string describing how walkable the area is (e.g. "very walkable", "somewhat walkable", "not very walkable").
  - propertyGrowth: An object containing the predicted property growth for flats and houses in the area over the next 5 years (e.g. "{ flats: '5%', houses: '7%' }").
  - areaVibe: An array of strings, each string being a single word describing the vibe of the area (e.g. ["trendy", "family-friendly", "quiet"]).

Here's an example of the format I want you to use:
[
  {
    "name": "Notting Hill",
    "matchPercentage": 92,
    "description": "Notting Hill is an affluent and fashionable area, known for its vibrant atmosphere, beautiful Victorian townhouses, and the famous Portobello Road Market.",
    "poshScore": 95,
    "coordinates": {
      "lat": 51.5151,
      "lng": -0.1994
    },
    "amenities": [
      "Close to Portobello Road Market",
      "Beautiful Victorian architecture",
      "Excellent transport links"
    ],
    "areaStats": {
      "crimeRate": "low",
      "transportScore": "excellent",
      "walkability": "very walkable",
      "propertyGrowth": {
        "flats": "6%",
        "houses": "8%"
      },
      "areaVibe": ["trendy", "vibrant", "affluent"]
    }
  },
  {
    "name": "Hampstead",
    "matchPercentage": 88,
    "description": "Hampstead is an affluent suburban area known for its intellectual, liberal, artistic, and literary associations.",
    "poshScore": 90,
    "coordinates": {
      "lat": 51.5574,
      "lng": -0.1772
    },
    "amenities": [
      "Close to Hampstead Heath",
      "Good schools",
      "Quiet and green"
    ],
    "areaStats": {
      "crimeRate": "very low",
      "transportScore": "good",
      "walkability": "very walkable",
      "propertyGrowth": {
        "flats": "4%",
        "houses": "6%"
      },
      "areaVibe": ["leafy", "quiet", "affluent"]
    }
  }
]

Please only respond with the JSON, and nothing else.
`;

export const analyzeAreaPreferences = async (areaDescription: string, apiKey: string, mapMode: string, location: string): Promise<AreaMatch[]> => {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  let searchLocation = '';

  if (mapMode === 'london') {
    searchLocation = 'London';
  }
  else if (mapMode === 'uk') {
    searchLocation = `the UK, near ${location}`;
  } else if (mapMode === 'europe') {
    if (location && location !== 'none') {
      searchLocation = location;
    } else {
      searchLocation = 'Europe';
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: AREA_PROMPT(areaDescription, searchLocation),
        },
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0].message?.content;

    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        if (Array.isArray(parsedContent)) {
          return parsedContent as AreaMatch[];
        } else {
          console.error("Unexpected content format: Not an array.");
          return [];
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Invalid JSON content:", content);
        return [];
      }
    } else {
      console.error("No content received from OpenAI API.");
      return [];
    }
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    return [];
  }
};

export const getEuropeanCountriesAndRegions = () => {
  return {
    'Austria': ['Vienna', 'Salzburg', 'Tyrol', 'Styria', 'Upper Austria'],
    'Belgium': ['Brussels', 'Flanders', 'Wallonia', 'Antwerp', 'Liège'],
    'Bulgaria': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse'],
    'Croatia': ['Zagreb', 'Split-Dalmatia', 'Istria', 'Dubrovnik-Neretva'],
    'Cyprus': ['Nicosia', 'Limassol', 'Paphos', 'Larnaca', 'Famagusta'],
    'Czech Republic': ['Prague', 'Central Bohemia', 'South Bohemia', 'Moravia-Silesia'],
    'Denmark': ['Copenhagen', 'Zealand', 'North Denmark', 'Central Denmark', 'Southern Denmark'],
    'Estonia': ['Harju', 'Tartu', 'Ida-Viru', 'Pärnu', 'Lääne-Viru'],
    'Finland': ['Uusimaa', 'Southwest Finland', 'Pirkanmaa', 'Northern Ostrobothnia'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Rhône-Alpes', 'Brittany', 'Normandy'],
    'Germany': ['Bavaria', 'Berlin', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Hamburg'],
    'Greece': ['Attica', 'Central Macedonia', 'Crete', 'Peloponnese', 'South Aegean'],
    'Hungary': ['Budapest', 'Pest', 'Debrecen', 'Szeged', 'Miskolc'],
    'Ireland': ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'],
    'Italy': ['Lombardy', 'Lazio', 'Tuscany', 'Veneto', 'Campania', 'Sicily', 'Sardinia'],
    'Latvia': ['Riga', 'Kurzeme', 'Latgale', 'Vidzeme', 'Zemgale'],
    'Lithuania': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'],
    'Luxembourg': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange'],
    'Malta': ['Gozo', 'Northern', 'Northern Harbour', 'South Eastern', 'Southern Harbour'],
    'Netherlands': ['North Holland', 'South Holland', 'Utrecht', 'North Brabant', 'Gelderland'],
    'Poland': ['Masovian', 'Lesser Poland', 'Silesian', 'Greater Poland', 'Lower Silesian'],
    'Portugal': ['Lisbon', 'Porto', 'Algarve', 'Madeira', 'Azores', 'Alentejo'],
    'Romania': ['Bucharest', 'Cluj', 'Iași', 'Timișoara', 'Constanța', 'Brașov', 'Transylvania'],
    'Slovakia': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica'],
    'Slovenia': ['Central Slovenia', 'Coastal–Karst', 'Southeast Slovenia', 'Drava'],
    'Spain': ['Madrid', 'Catalonia', 'Andalusia', 'Valencia', 'Basque Country', 'Galicia'],
    'Sweden': ['Stockholm', 'Västra Götaland', 'Skåne', 'Uppsala', 'Östergötland'],
    'Trinidad and Tobago': ['Port of Spain', 'San Fernando', 'Arima', 'Chaguanas', 'Point Fortin']
  };
};
