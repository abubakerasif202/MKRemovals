export type AdelaideRegionGroup =
  | 'Central & Park Lands'
  | 'Eastern Suburbs'
  | 'Western & Coastal'
  | 'Northern Corridor'
  | 'Southern & Foothills'
  | 'Adelaide Hills'
  | 'North-East Corridor';

export interface ServiceAreaItem {
  id: string;
  slug: string;
  regionGroup: AdelaideRegionGroup;
  title: string;
  shortName: string;
  keySuburbs: string[];
  postcodes: string[];
  summary: string;
  localMovingProfile: string;
  accessAndParkingConsiderations: string[];
  commonPropertyTypes: string[];
  arterialCorridors: string[];
  planningTips: string[];
}

export const MRK_SERVICE_AREAS: ServiceAreaItem[] = [
  {
    id: 'adelaide-cbd-park-lands',
    slug: 'adelaide-cbd-park-lands',
    regionGroup: 'Central & Park Lands',
    title: 'Adelaide CBD & North Adelaide',
    shortName: 'Adelaide CBD & North Adelaide',
    keySuburbs: [
      'Adelaide CBD',
      'North Adelaide',
      'Kent Town',
      'Wayville',
      'Goodwood',
      'Parkside',
      'Unley',
      'Mile End',
    ],
    postcodes: ['5000', '5006', '5034', '5063', '5067'],
    summary:
      'Apartment towers, heritage bluestone cottages, and commercial suites across the Adelaide square mile, North Adelaide, and Park Lands fringe.',
    localMovingProfile:
      'Moves within the 5000 and 5006 postcodes typically involve either multi-storey apartment buildings with strict lift lock-off bookings or historic terrace cottages with narrow rear laneways and timed street parking.',
    accessAndParkingConsiderations: [
      'Book building service lifts and loading docks with strata management at least 7–14 days in advance.',
      'Check Adelaide City Council kerbside signage for 15-minute/30-minute loading zone limits, bus lanes, and peak-hour clearways.',
      'Confirm basement height clearances—most removal trucks require street-level or open-air dock loading rather than 2.1m underground car parks.',
      'In North Adelaide and Parkside cottages, measure narrow hallway arches before moving king mattresses or deep modular lounges.',
    ],
    commonPropertyTypes: [
      'High-rise residential apartments along North Terrace, Morphett Street, Wakefield Street, and Hutt Street',
      'Single-fronted heritage cottages and Victorian terraces in North Adelaide and Parkside',
      'Boutique commercial offices and consulting rooms around East Terrace, Kent Town, and Greenhill Road',
    ],
    arterialCorridors: ['North Terrace', 'West Terrace', 'East Terrace', 'Greenhill Road', 'O’Connell Street'],
    planningTips: [
      'Share your exact building name and loading bay street entrance when submitting a quote.',
      'Have all small items boxed and stacked near the entry door before your lift booking window starts.',
    ],
  },
  {
    id: 'norwood-burnside-eastern-suburbs',
    slug: 'norwood-burnside-eastern-suburbs',
    regionGroup: 'Eastern Suburbs',
    title: 'Norwood, Burnside & Eastern Suburbs',
    shortName: 'Eastern Suburbs',
    keySuburbs: [
      'Norwood',
      'Burnside',
      'Toorak Gardens',
      'Kensington',
      'Magill',
      'Payneham',
      'St Peters',
      'Glenunga',
      'Beaumont',
    ],
    postcodes: ['5065', '5066', '5067', '5068', '5069', '5070', '5072'],
    summary:
      'Established family residences, sandstone villas, leafy avenues, and foothills homes across Adelaide’s inner and upper East.',
    localMovingProfile:
      'The Eastern Suburbs combine grand sandstone villas in St Peters and Toorak Gardens with modern townhouses in Norwood and steeper foothills blocks in Beaumont and Burnside.',
    accessAndParkingConsiderations: [
      'Tree-lined avenues with low-hanging plane or jacaranda branches can restrict high-bodied trucks from pulling right to the kerb—let us know if street trees overhang your driveway.',
      'Upper Burnside, Beaumont, and Rosslyn Park properties often feature sloped driveways or stepped front entries.',
      'Along The Parade (Norwood) and Magill Road precincts, side-street parking access is often cleaner than main-road clearways.',
    ],
    commonPropertyTypes: [
      'Large 3–5 bedroom family villas and character return-verandah homes',
      'Executive townhouses and gated courtyard residences',
      'Multi-level foothills homes with elevated decks and double garages',
    ],
    arterialCorridors: ['The Parade', 'Portrush Road', 'Fullarton Road', 'Magill Road', 'Payneham Road'],
    planningTips: [
      'Take note of Portrush Road freight and school-hour traffic windows when planning arrival times.',
      'Include outdoor dining settings, wine cabinets, and garden pots in your initial quote inventory.',
    ],
  },
  {
    id: 'glenelg-henley-western-coastal',
    slug: 'glenelg-henley-western-coastal',
    regionGroup: 'Western & Coastal',
    title: 'Glenelg, Henley Beach & Western Suburbs',
    shortName: 'Western & Coastal',
    keySuburbs: [
      'Glenelg',
      'Henley Beach',
      'Brighton',
      'West Lakes',
      'Semaphore',
      'Port Adelaide',
      'Fulham Gardens',
      'Plympton',
      'Torrensville',
    ],
    postcodes: ['5015', '5019', '5021', '5022', '5024', '5031', '5038', '5045', '5048'],
    summary:
      'Esplanade apartments, coastal family homes, waterfront townhouses, and inner-west villa relocations from Brighton to Semaphore.',
    localMovingProfile:
      'Coastal moves frequently involve multi-level beachfront apartments in Glenelg and Holdfast Shores, narrow esplanade side streets, or two-storey modern family homes with upstairs living areas facing the water.',
    accessAndParkingConsiderations: [
      'Upside-down floor plans (where living rooms, kitchens, and dining suites sit on the second floor for ocean views) require extra stair handling time.',
      'Glenelg and Henley Square precincts become busy with beach parking on warm weekends—early morning starts secure closer truck access.',
      'Sea breeze gusts along the Esplanade require keeping lightweight cartons and wrapping materials secured during loading.',
    ],
    commonPropertyTypes: [
      'Marina and Esplanade apartments in Glenelg, West Lakes, and New Port',
      'Two-storey contemporary coastal homes with upstairs kitchens and balconies',
      'Inner-west character homes in Torrensville, Thebarton, and Mile End',
    ],
    arterialCorridors: ['Anzac Highway', 'Henley Beach Road', 'Tapleys Hill Road', 'Port Road', 'Military Road'],
    planningTips: [
      'Mention if your lounge or fridge needs to go up an internal staircase to an upstairs living zone.',
      'Confirm strata lift dimensions for Holdfast Promenade and Esplanade buildings.',
    ],
  },
  {
    id: 'prospect-mawson-lakes-north',
    slug: 'prospect-mawson-lakes-north',
    regionGroup: 'Northern Corridor',
    title: 'Prospect, Mawson Lakes & Northern Suburbs',
    shortName: 'Northern Suburbs',
    keySuburbs: [
      'Prospect',
      'Walkerville',
      'Blair Athol',
      'Mawson Lakes',
      'Salisbury',
      'Golden Grove',
      'Gawler',
      'Munno Para',
      'Elizabeth',
    ],
    postcodes: ['5081', '5082', '5084', '5095', '5108', '5112', '5114', '5118'],
    summary:
      'Inner-north character homes in Prospect and Walkerville through to master-planned estates in Mawson Lakes, Salisbury, and Gawler.',
    localMovingProfile:
      'From inner-north bungalows along Prospect Road to townhouses in Mawson Lakes and newly built family homes across the northern growth corridor, efficient routing via the North-South Motorway and Main North Road keeps transit predictable.',
    accessAndParkingConsiderations: [
      'Townhouse courts in Mawson Lakes and Lightsview often have narrow rear-lane garages; front street kerb access may require carrying items through a courtyard gate.',
      'New housing estates in Angle Vale, Munno Para, and Riverlea can have active construction vehicles on narrow streets—let us know if builders are working adjacent to your lot.',
      'Large family blocks in Salisbury and Gawler often include workshop sheds and outdoor equipment that should be listed in your quote.',
    ],
    commonPropertyTypes: [
      'California bungalows and Tudor homes in Prospect, Nailsworth, and Walkerville',
      'Compact multi-level townhouses in Lightsview and Mawson Lakes',
      '4-bedroom single-storey and double-storey family homes across Northern growth estates',
    ],
    arterialCorridors: ['Main North Road', 'North-South Motorway (M2)', 'Port Wakefield Road', 'Grand Junction Road'],
    planningTips: [
      'For Lightsview or Mawson Lakes townhouses, let us know whether the truck should load from the front street or rear laneway.',
      'Ensure freshly laid driveways in new builds are cured and cleared for heavy vehicle weight before parking a truck on them.',
    ],
  },
  {
    id: 'unley-mitcham-southern-foothills',
    slug: 'unley-mitcham-southern-foothills',
    regionGroup: 'Southern & Foothills',
    title: 'Unley, Mitcham, Marion & Southern Suburbs',
    shortName: 'Southern & Foothills',
    keySuburbs: [
      'Unley',
      'Mitcham',
      'Colonel Light Gardens',
      'Marion',
      'Blackwood',
      'Hallett Cove',
      'Morphett Vale',
      'Seaford',
      'McLaren Vale',
    ],
    postcodes: ['5041', '5043', '5050', '5051', '5061', '5062', '5158', '5162', '5169'],
    summary:
      'Heritage bungalows in Unley and Colonel Light Gardens, leafy Mitcham foothills homes, and southern coastal/vale relocations via the Southern Expressway.',
    localMovingProfile:
      'Southern moves range from flat inner-south character homes in Unley, Hyde Park, and Colonel Light Gardens to split-level foothills homes in Blackwood and Belair, plus coastal and Southern Expressway moves down to Seaford and McLaren Vale.',
    accessAndParkingConsiderations: [
      'Blackwood, Belair, Eden Hills, and Hallett Cove properties frequently have steep, curved driveways or tiered timber steps from driveway to entry.',
      'South Road upgrade works and peak intersections can affect cross-suburb transit; we plan southern routes via the Southern Expressway (M2) or Goodwood/Marion roads where practical.',
      'Colonel Light Gardens heritage streetscapes have wide verges and mature street trees—keep driveway aprons clear for easy ramp setup.',
    ],
    commonPropertyTypes: [
      '1920s bungalow homes and sandstone villas in Unley, Malvern, and Colonel Light Gardens',
      'Split-level foothills residences in Mitcham, Belair, and Blackwood',
      'Family homes and coastal properties across Marion, Hallett Cove, and Seaford',
    ],
    arterialCorridors: ['Unley Road', 'Belair Road', 'Goodwood Road', 'Marion Road', 'Southern Expressway (M2)'],
    planningTips: [
      'For split-level homes in Blackwood, Belair, or Hallett Cove, count the external and internal steps so we can plan handling accurately.',
    ],
  },
  {
    id: 'stirling-mount-barker-adelaide-hills',
    slug: 'stirling-mount-barker-adelaide-hills',
    regionGroup: 'Adelaide Hills',
    title: 'Stirling, Crafers, Hahndorf & Mount Barker',
    shortName: 'Adelaide Hills',
    keySuburbs: [
      'Stirling',
      'Crafers',
      'Aldgate',
      'Bridgewater',
      'Hahndorf',
      'Mount Barker',
      'Nairne',
      'Uraidla',
    ],
    postcodes: ['5152', '5153', '5154', '5155', '5245', '5251', '5252'],
    summary:
      'Acreage properties, Hills character homes, and Mount Barker estates serviced via the South Eastern Freeway.',
    localMovingProfile:
      'Adelaide Hills relocations require extra attention to driveway turnaround room, overhanging gums, winter wet-weather footing, and South Eastern Freeway transit time between the Hills and metropolitan Adelaide.',
    accessAndParkingConsiderations: [
      'Unsealed gravel driveways, tight hairpin turns, or low timber carports in Stirling, Aldgate, and Bridgewater may limit large truck entry—always describe your driveway width and surface.',
      'Allow for South Eastern Freeway travel time and gradient descent rules when coordinating settlement times between Adelaide plains and Mount Barker.',
      'Damp winter leaves or mossy stone steps in the Hills require extra slip-prevention care during loading.',
    ],
    commonPropertyTypes: [
      'Hills character residences and acreage homes set back on long driveways',
      'Modern family estates in Mount Barker, Aston Hills, and Nairne',
      'Stone cottages and split-level timber homes across Crafers, Stirling, and Hahndorf',
    ],
    arterialCorridors: ['South Eastern Freeway (M1)', 'Mount Barker Road', 'Greenhill Road', 'Strathalbyn Road'],
    planningTips: [
      'Let us know if your driveway has a turning circle or if the truck will need to reverse in or park at the road verge.',
      'Confirm travel time expectations between metropolitan Adelaide and Mount Barker / Adelaide Hills in your quote.',
    ],
  },
  {
    id: 'tea-tree-gully-modbury-north-east',
    slug: 'tea-tree-gully-modbury-north-east',
    regionGroup: 'North-East Corridor',
    title: 'Campbelltown, Modbury & Tea Tree Gully',
    shortName: 'North-East Suburbs',
    keySuburbs: [
      'Campbelltown',
      'Rostrevor',
      'Newton',
      'Paradise',
      'Modbury',
      'Tea Tree Gully',
      'Highbury',
      'Wynn Vale',
      'Greenwith',
    ],
    postcodes: ['5073', '5074', '5075', '5089', '5091', '5092', '5125', '5126', '5127'],
    summary:
      'Family homes, courtyard townhouses, and foothills residences along the Lower North East Road and North East Road corridors.',
    localMovingProfile:
      'The North-East corridor blends modern infill townhouses in Campbelltown and Newton with elevated family homes in Rostrevor, Highbury, Tea Tree Gully, and Greenwith.',
    accessAndParkingConsiderations: [
      'Shared hammerhead driveways in new Campbelltown and Newton townhouse subdivisions can be tight for commercial trucks—kerbside street loading is often faster.',
      'Elevated foothills blocks in Rostrevor, Highbury, and Tea Tree Gully often have sloped driveways or multi-step front verandahs.',
    ],
    commonPropertyTypes: [
      'Modern double-storey courtyard townhouses in Campbelltown, Tranmere, and Newton',
      'Established 3–4 bedroom family homes with sheds and outdoor entertaining areas in Modbury, Wynn Vale, and Greenwith',
    ],
    arterialCorridors: ['North East Road', 'Lower North East Road', 'Grand Junction Road', 'McIntyre Road'],
    planningTips: [
      'If your property sits on a shared community-title driveway, let Neighbors know ahead of moving morning so the access lane stays clear.',
    ],
  },
];

export function getServiceAreaBySlug(slug: string): ServiceAreaItem | undefined {
  return MRK_SERVICE_AREAS.find((area) => area.slug === slug);
}

export const ADELAIDE_REGION_GROUPS: AdelaideRegionGroup[] = [
  'Central & Park Lands',
  'Eastern Suburbs',
  'Western & Coastal',
  'Northern Corridor',
  'Southern & Foothills',
  'Adelaide Hills',
  'North-East Corridor',
];
