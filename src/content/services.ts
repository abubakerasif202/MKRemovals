export interface ServiceItem {
  id: string;
  slug: string;
  indexNumber: string;
  title: string;
  shortTitle: string;
  kicker: string;
  summary: string;
  heroDescription: string;
  idealFor: string[];
  whatAffectsYourQuote: {
    factor: string;
    detail: string;
  }[];
  preparationChecklist: string[];
  whatToConfirmWithUs: string[];
  adelaideLogisticsNote: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
  featuredSpan?: 'wide' | 'standard';
}

export const MRK_SERVICES: ServiceItem[] = [
  {
    id: 'house-removals',
    slug: 'house-removals',
    indexNumber: '01',
    title: 'Residential House Removals',
    shortTitle: 'House Removals',
    kicker: 'Full & Partial Household Relocations',
    summary:
      'Structured room-by-room loading, furniture protection, and coordinated transport for single-storey and multi-level Adelaide homes.',
    heroDescription:
      'Moving an entire household across Adelaide requires careful sequencing, clear driveway access planning, and methodical loading so fragile items and heavy timber or whitegoods travel safely.',
    idealFor: [
      '2 to 5+ bedroom family homes across metropolitan Adelaide',
      'Character villas, bungalows, and modern split-level residences',
      'Downsizing moves or staged settlements requiring flexible timing',
      'Households wanting clear communication directly with the operator',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Household Volume & Room Count',
        detail:
          'Total cubic volume of bedroom suites, living room furniture, outdoor settings, shed items, and packed cartons determines truck space and loading time.',
      },
      {
        factor: 'Driveway & Street Access',
        detail:
          'Long driveways, steep gradients in foothills suburbs, narrow heritage streets, or overhanging trees affect how close the truck can park to your front door.',
      },
      {
        factor: 'Internal Stairs & Split Levels',
        detail:
          'Two-storey residences or split-level layouts require extra handling time and careful wall/balustrade clearance for beds and lounges.',
      },
      {
        factor: 'Disassembly & Reassembly Needs',
        detail:
          'Let us know in advance if bed frames, dining tables, or modular lounges need disassembly prior to loading.',
      },
    ],
    preparationChecklist: [
      'Disconnect, drain, and dry washing machines, dishwashers, and fridge water lines 24 hours ahead.',
      'Seal all moving cartons with heavy-duty tape and label both the top and side by destination room.',
      'Keep driveways and side gates clear of vehicles, bins, and garden pots on moving morning.',
      'Set aside essential personal documents, keys, medication, and valuables to travel with you personally.',
    ],
    whatToConfirmWithUs: [
      'Exact pickup and delivery suburbs and whether settlement times constrain keys handover.',
      'Rough inventory of major furniture pieces (e.g., king beds, double-door fridges, outdoor spas or gym gear).',
      'Applicable hourly rate ($130–$135/hr indicative range), crew allocation, and the 3-hour minimum plus 1-hour call-out fee (rate includes GST).',
    ],
    adelaideLogisticsNote:
      'In established Adelaide suburbs with narrow heritage streets or timed school-zone clearways, early morning positioning helps keep truck loading smooth and uninterrupted.',
    faqs: [
      {
        question: 'How early should I request a house removal quote in Adelaide?',
        answer:
          'As soon as you have a target settlement or lease handover window. Even if your exact date is still flexible, sharing your inventory and suburbs early lets us discuss scheduling options.',
      },
      {
        question: 'Can you move outdoor settings, garage tools, and potted plants?',
        answer:
          'Yes—please include garage contents, barbecues (with gas bottles disconnected, as flammable gas cylinders cannot travel inside enclosed trucks), and heavy garden pots in your quote notes so we allow adequate space.',
      },
    ],
    relatedSlugs: ['packing-move-preparation', 'furniture-single-item-moves', 'heavy-bulky-item-moves'],
    featuredSpan: 'wide',
  },
  {
    id: 'apartment-strata-moves',
    slug: 'apartment-strata-moves',
    indexNumber: '02',
    title: 'Apartment & Strata Relocations',
    shortTitle: 'Apartment Moves',
    kicker: 'Lift Windows, Loading Docks & Walk-Ups',
    summary:
      'Time-critical relocations tailored for Adelaide CBD towers, coastal apartments, and medium-density strata complexes with strict lift bookings.',
    heroDescription:
      'Apartment moves succeed or fail on preparation before moving day. We coordinate around building manager rules, goods-lift dimensions, loading dock height clearances, and stairwell access.',
    idealFor: [
      'High-rise apartments in Adelaide CBD, North Adelaide, and Glenelg',
      'Three-storey walk-up units and townhomes with shared driveways',
      'Moves with fixed 2-hour or 3-hour strata lift booking windows',
      'Tenants needing efficient turnaround between lease end and new key pickup',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Lift Exclusive-Use Windows',
        detail:
          'Whether your building provides a padded service lift on exclusive lock-off or requires sharing passenger lifts with residents.',
      },
      {
        factor: 'Loading Zone & Basement Clearance',
        detail:
          'Commercial moving trucks typically require street-level loading bays rather than low-clearance underground car parks (often capped at 2.1m–2.2m).',
      },
      {
        factor: 'Long Carry Distances',
        detail:
          'Corridor length from apartment door to lift lobby, and from dock to street parking bay, directly influences trolley transit time.',
      },
      {
        factor: 'Stairwell Flights (Walk-Ups)',
        detail:
          'For complexes without lifts, please specify the floor number and whether stair turns are tight for mattresses or L-shaped sofas.',
      },
    ],
    preparationChecklist: [
      'Reserve your building goods lift and loading bay with strata management as soon as your date is known.',
      'Measure lift door height, internal depth, and diagonal clearance for oversized couches or fridge-freezers.',
      'Have all small loose items boxed before the crew arrives so lift time is dedicated to continuous loading.',
      'Check if a council temporary parking permit or loading zone pass is required outside your building.',
    ],
    whatToConfirmWithUs: [
      'Exact lift booking start and finish times at both pickup and destination buildings.',
      'Maximum height clearance if the loading zone is covered or inside a podium level.',
      'Hourly rate inclusions, the 3-hour minimum, and any parking/access requirements.',
    ],
    adelaideLogisticsNote:
      'Adelaide CBD streets (such as Waymouth, Pirie, Grote, and North Terrace precincts) often have ticketed loading zones or peak-hour bus lanes—confirming street kerbside rules ahead of time prevents delays.',
    faqs: [
      {
        question: 'Can your truck enter underground apartment car parks?',
        answer:
          'Most removal trucks exceed standard 2.1m residential basement height bars. We normally load from a ground-level loading dock, driveway apron, or kerbside loading zone near the foyer.',
      },
      {
        question: 'What if my building only allows moves between 9:00 am and 1:00 pm?',
        answer:
          'Specify your exact strata window in the quote form so we can discuss realistic scheduling and arrival timing.',
      },
    ],
    relatedSlugs: ['house-removals', 'furniture-single-item-moves', 'packing-move-preparation'],
    featuredSpan: 'standard',
  },
  {
    id: 'office-commercial-relocations',
    slug: 'office-commercial-relocations',
    indexNumber: '03',
    title: 'Office & Commercial Relocations',
    shortTitle: 'Office Relocations',
    kicker: 'Workstations, Studios & Retail Fit-Outs',
    summary:
      'Organized commercial transitions for small-to-medium offices, consulting suites, creative studios, and retail spaces across Adelaide.',
    heroDescription:
      'Relocating a workplace demands structured labelling and minimal operational downtime. We move workstations, boardroom tables, filing archives, boxed IT equipment, and studio fixtures systematically.',
    idealFor: [
      'Professional suites, medical/allied health rooms, and legal or accounting offices',
      'Creative studios, showrooms, and boutique retail spaces',
      'Internal floor-to-floor office reconfigurations',
      'Businesses preferring early-morning or scheduled transition windows',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Workstation & Desk Count',
        detail:
          'Number of sit-stand desks, ergonomic chairs, tambour cabinets, and whether modular desks require disassembly.',
      },
      {
        factor: 'Building Access & Security Sign-In',
        detail:
          'Commercial tower dock bookings, swipe-card access across floors, and after-hours building access protocols.',
      },
      {
        factor: 'Archive & Stock Volume',
        detail:
          'Heavy archive boxes, paper stock, or retail shelving require balanced trolley loads and weight distribution.',
      },
      {
        factor: 'IT & Monitor Preparation',
        detail:
          'Whether monitors, desktop towers, and cabling are pre-disconnected and boxed by your staff prior to loading.',
      },
    ],
    preparationChecklist: [
      'Assign a floor-plan number to every desk at the new office and label crates/furniture with matching zone codes.',
      'Have staff disconnect and pack laptops, monitors, keyboards, and personal desk items into labelled cartons.',
      'Empty lateral filing cabinets and tall bookshelves so units can be moved safely without structural racking.',
      'Confirm commercial loading dock reservation times and security contacts at both sites.',
    ],
    whatToConfirmWithUs: [
      'Preferred move day and whether building management restricts commercial moves to specific hours.',
      'List of oversized items such as 10-seater boardroom tables, commercial printers/copiers, or fireproof safes.',
      'Tax invoice requirements, ABN details (ABN 95 685 822 473 supplied), and hourly rate terms (rate includes GST).',
    ],
    adelaideLogisticsNote:
      'For CBD and fringe commercial precincts (Kent Town, Greenhill Road, Unley Road, Mile End), coordinating dock access outside peak commuter windows significantly speeds up turnaround.',
    faqs: [
      {
        question: 'Do you disconnect server racks or hardwired commercial photocopiers?',
        answer:
          'Your IT technician or print-lease provider should decommission and secure specialized servers or leased multifunction copiers prior to transport; once prepared, we handle the physical relocation.',
      },
      {
        question: 'Can we move just a boardroom suite and 8 workstations?',
        answer:
          'Yes. Share your inventory list in the quote form and we will scope the move to match your exact commercial load.',
      },
    ],
    relatedSlugs: ['apartment-strata-moves', 'heavy-bulky-item-moves', 'furniture-single-item-moves'],
    featuredSpan: 'standard',
  },
  {
    id: 'furniture-single-item-moves',
    slug: 'furniture-single-item-moves',
    indexNumber: '04',
    title: 'Furniture & Few-Item Removals',
    shortTitle: 'Furniture Removals',
    kicker: 'Targeted Pickups, Store Purchases & Partial Moves',
    summary:
      'Dedicated transport for lounges, dining suites, bedroom furniture, whitegoods, and partial household loads when you do not need a full-house move.',
    heroDescription:
      'Not every job is a full house relocation. Whether you are moving five key furniture pieces between family homes, collecting a Gumtree/Showroom dining suite, or shifting whitegoods and beds into a new share house, we provide careful padded transport.',
    idealFor: [
      'Moving large furniture items that will not fit in a ute or trailer',
      'Showroom, auction, or private-sale furniture pickups and deliveries',
      'Student, share-house, or single-room moves with a bed, desk, and boxes',
      'Staging furniture between properties prior to real estate photography',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Item Dimensions & Weight',
        detail:
          'Exact length, height, and weight of solid timber buffets, marble dining tables, modular chaise lounges, or French-door refrigerators.',
      },
      {
        factor: 'Doorway & Hallway Clearances',
        detail:
          'Whether items fit cleanly through standard 820mm doorways or require door removal, window access, or leg detachment.',
      },
      {
        factor: 'Travel Distance Between Suburbs',
        detail:
          'Direct distance and traffic corridor between pickup and drop-off postcodes across Adelaide.',
      },
      {
        factor: 'Ground Floor vs Upstairs Placement',
        detail:
          'Delivering to an upstairs living area or down external steps requires additional handling care and time.',
      },
    ],
    preparationChecklist: [
      'Measure both the furniture item and the narrowest doorway, hallway turn, or stair landing at the destination.',
      'Remove loose glass shelves, drawers, or cushions so the main frame can be wrapped and carried securely.',
      'Ensure someone is present at both pickup and delivery addresses during the agreed window.',
    ],
    whatToConfirmWithUs: [
      'Exact list and rough measurements of each furniture piece or appliance.',
      '3-hour minimum plus 1-hour call-out fee and applicable hourly rate ($130–$135/hr indicative range) for small or single-item jobs.',
      'Any fragile surfaces such as glass tabletops, stone slabs, or high-gloss cabinetry.',
    ],
    adelaideLogisticsNote:
      'Grouping a few heavy furniture pieces into a single scheduled run is often the cleanest way to complete a partial move without hiring and driving a self-drive truck.',
    faqs: [
      {
        question: 'Is there a minimum booking time for moving just one or two items?',
        answer:
          'A 3-hour minimum plus a 1-hour call-out fee applies, including for small or single-item jobs. Request a quote or call 0423 653 342 to confirm exact terms for your items.',
      },
      {
        question: 'Can you move a fridge upright?',
        answer:
          'Please mention your fridge height and model in your enquiry so we can confirm upright clearance and handling requirements.',
      },
    ],
    relatedSlugs: ['heavy-bulky-item-moves', 'house-removals', 'apartment-strata-moves'],
    featuredSpan: 'standard',
  },
  {
    id: 'packing-move-preparation',
    slug: 'packing-move-preparation',
    indexNumber: '05',
    title: 'Packing & Move Preparation Support',
    shortTitle: 'Packing & Prep',
    kicker: 'Structured Carton Prep & Furniture Wrapping',
    summary:
      'Practical assistance preparing household cartons, kitchenware, fragile decor, and furniture disassembly ahead of loading.',
    heroDescription:
      'Well-packed boxes and properly disassembled furniture make loading faster and safer. Discuss your preparation requirements with us when requesting your quote so we can plan time and materials appropriately.',
    idealFor: [
      'Busy professionals and families needing help preparing ahead of moving day',
      'Kitchen, glassware, and fragile cabinet packing preparation',
      'Pre-move bed frame and dining table disassembly',
      'Unpacking placement and room setup assistance at your new address',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Scope of Packing Required',
        detail:
          'Whether you need help with fragile rooms only (kitchen, dining, study) or broader household carton preparation.',
      },
      {
        factor: 'Packing Materials & Boxes',
        detail:
          'Whether you are supplying your own cartons, butcher paper, and bubble wrap, or need to discuss material requirements in advance.',
      },
      {
        factor: 'Same-Day vs Day-Before Scheduling',
        detail:
          'Larger homes often benefit from completing packing preparation the day before the truck load.',
      },
    ],
    preparationChecklist: [
      'Declutter and donate unwanted items before packing begins so you only pay to pack and move what you keep.',
      'Group fragile glassware, ceramics, and framed artwork clearly so they receive padded wrapping.',
      'Keep hazardous items (paint tins, aerosols, pool chemicals, gas bottles, fuel) separate—these require personal transport.',
    ],
    whatToConfirmWithUs: [
      'Whether you already have boxes and tape on site or want to discuss material options.',
      'How many rooms or cupboards need packing support.',
      'Hourly rate structure ($130–$135/hr indicative guidance) and recommended time allocation.',
    ],
    adelaideLogisticsNote:
      'Having uniform, sturdy moving cartons stacked to waist height in accessible rooms dramatically reduces loading time on move day.',
    faqs: [
      {
        question: 'Do I have to supply my own boxes and tape?',
        answer:
          'Please let us know in your quote request whether you already have packing cartons and wrap on site or wish to discuss supply options prior to your booking.',
      },
      {
        question: 'What items cannot be packed into the removal truck?',
        answer:
          'Flammable liquids, LPG gas cylinders, petrol lawnmowers with fuel in the tank, wet paint, fireworks, and corrosive chemicals must not be loaded into enclosed moving trucks.',
      },
    ],
    relatedSlugs: ['house-removals', 'apartment-strata-moves', 'office-commercial-relocations'],
    featuredSpan: 'standard',
  },
  {
    id: 'heavy-bulky-item-moves',
    slug: 'heavy-bulky-item-moves',
    indexNumber: '06',
    title: 'Heavy & Bulky Item Handling',
    shortTitle: 'Heavy & Bulky Items',
    kicker: 'Oversized Timber, Stone Tables, Gym Gear & Appliances',
    summary:
      'Planned handling for oversized, awkward, or dense household and commercial items requiring careful path assessment and crew coordination.',
    heroDescription:
      'Heavy items such as solid marble or hardwood tables, home gym machines, double-door commercial fridges, tool chests, and heavy cabinetry cannot be treated like standard boxes. We assess weight, stair turns, and threshold steps before lifting.',
    idealFor: [
      'Solid stone, marble, or concrete-top dining and outdoor tables',
      'Commercial-grade treadmills, multi-station home gyms, and squat racks',
      'Large workshop toolboxes, wine fridges, and oversized buffets',
      'Internal repositioning of heavy furniture between floors during renovations',
    ],
    whatAffectsYourQuote: [
      {
        factor: 'Estimated Weight & Dimensions',
        detail:
          'Accurate weight and dimensions determine whether standard two-person handling is safe or additional manpower/equipment is required.',
      },
      {
        factor: 'Steps, Kerbs & Staircases',
        detail:
          'Even 3 or 4 front verandah steps, gravel paths, or tight L-shaped hallways must be disclosed beforehand for safe planning.',
      },
      {
        factor: 'Floor Surface Protection',
        detail:
          'Polished floorboards, porcelain tiles, or soft lawn pathways require planned trolley routing.',
      },
    ],
    preparationChecklist: [
      'Provide photos or exact measurements (L x W x H and approximate kg) when submitting your quote request.',
      'Remove detachable weights, pins, table legs, or removable shelving to reduce dead-lift mass.',
      'Clear a minimum 1.2m wide unobstructed pathway from the item to the driveway.',
    ],
    whatToConfirmWithUs: [
      'Exact item type, approximate weight in kilograms, and any steps at pickup or delivery.',
      'Whether specialized heavy-item surcharges, extra crew members, or specific equipment are required for your item.',
      'Confirmation that the item falls within our approved safe-lifting scope before moving day.',
    ],
    adelaideLogisticsNote:
      'In Adelaide Hills and foothills properties with stepped decks or steep driveways, sharing smartphone photos of the access path helps us confirm feasibility before arrival.',
    faqs: [
      {
        question: 'Can you move every type of piano or commercial safe?',
        answer:
          'Not all pianos, safes, or spa pools can be moved with standard household removal crews. Always disclose exact make, weight, and step counts in your quote enquiry so we can confirm whether we can safely undertake the job.',
      },
      {
        question: 'Why do you ask about 2 or 3 porch steps for heavy items?',
        answer:
          'Rolling a 150kg+ item on flat ground with heavy-duty skates is very different from lifting it up porch steps. Knowing step counts upfront ensures safe crew planning.',
      },
    ],
    relatedSlugs: ['furniture-single-item-moves', 'house-removals', 'office-commercial-relocations'],
    featuredSpan: 'wide',
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return MRK_SERVICES.find((service) => service.slug === slug);
}
