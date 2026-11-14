export type FaqCategory = 'Pricing & Quotes' | 'Moving Day & Access' | 'Packing & Items' | 'Scheduling & Areas';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const MRK_FAQS: FaqItem[] = [
  {
    id: 'hourly-rate-range',
    category: 'Pricing & Quotes',
    question: 'What are your hourly rates and what is included in the $130–$135/hr indicative range?',
    answer:
      'Our owner-supplied indicative hourly rate range is AUD $130–$135 per hour. Because every move differs in volume, truck and crew requirements, stairs, and travel distance across Adelaide, final pricing depends on your specific moving requirements. When we respond to your quote request, we clearly confirm crew inclusions and any other charges before you lock in your move. The hourly rate includes GST, with a 3-hour minimum plus a 1-hour call-out fee.',
  },
  {
    id: 'how-to-get-accurate-quote',
    category: 'Pricing & Quotes',
    question: 'What details should I include to get the most accurate moving quote?',
    answer:
      'Share your pickup and destination suburbs, target moving date (or date flexibility), property type (single-storey house, two-storey home, apartment with lift or stairs), parking/driveway access, and a realistic list of major furniture pieces and approximate box count.',
  },
  {
    id: 'fixed-vs-hourly',
    category: 'Pricing & Quotes',
    question: 'Can I book online right away or do I request a quote first?',
    answer:
      'All moves start with a quote enquiry or a direct phone conversation on 0423 653 342. We do not use automated blind bookings because confirming truck access, inventory size, and your preferred time window first avoids moving-day surprises.',
  },
  {
    id: 'apartment-lifts-and-parking',
    category: 'Moving Day & Access',
    question: 'What do I need to arrange for an Adelaide CBD or apartment move?',
    answer:
      'Contact your building or strata manager as early as possible to reserve the service lift (with protective curtains fitted) and loading dock bay. Please also check the loading bay height clearance—commercial removal trucks usually require street-level or open dock access rather than low underground car parks.',
  },
  {
    id: 'stairs-and-steep-driveways',
    category: 'Moving Day & Access',
    question: 'Does it matter if my house has a steep driveway or internal stairs?',
    answer:
      'Yes. In Adelaide foothills and Hills suburbs (such as Burnside, Blackwood, Beaumont, or Stirling), steep or narrow driveways and multi-step entries affect where the truck can safely park and how long loading takes. Mentioning steps and driveway gradients upfront helps us plan properly.',
  },
  {
    id: 'appliances-and-disassembly',
    category: 'Packing & Items',
    question: 'How should I prepare fridges, washing machines, and beds before the crew arrives?',
    answer:
      'Empty and defrost refrigerators, disconnect and drain washing machines and dishwashers, and remove bedding from mattresses. If you need bed frames or dining tables disassembled and reassembled, note that in your quote form so we factor it into your schedule.',
  },
  {
    id: 'restricted-items',
    category: 'Packing & Items',
    question: 'Are there items that cannot be loaded onto the moving truck?',
    answer:
      'For safety compliance, enclosed moving trucks cannot carry LPG gas cylinders (including swap-and-go BBQ bottles), petrol cans, lawnmowers containing fuel, aerosols, wet paint, fireworks, pool chemicals, or hazardous materials. Please also carry jewellery, passports, cash, and critical personal documents with you personally.',
  },
  {
    id: 'heavy-or-fragile-items',
    category: 'Packing & Items',
    question: 'Can you move heavy marble tables, home gym equipment, or oversized items?',
    answer:
      'We handle many bulky household and office pieces, provided we review the dimensions, approximate weight, and step/access path beforehand. Please disclose any item over 80kg or unusual dimensions in your quote notes so we can confirm safe handling requirements.',
  },
  {
    id: 'service-coverage-adelaide',
    category: 'Scheduling & Areas',
    question: 'Which areas of Adelaide do you cover?',
    answer:
      'We coordinate moves across metropolitan Adelaide—including the CBD & North Adelaide, Eastern Suburbs, Western & Coastal suburbs, Northern suburbs, Southern suburbs & Foothills, North-East corridor, and Adelaide Hills. Submit your pickup and destination postcodes or suburbs to confirm availability for your route.',
  },
  {
    id: 'date-flexibility',
    category: 'Scheduling & Areas',
    question: 'What if my settlement date or lease start time is not confirmed yet?',
    answer:
      'You can still submit a quote enquiry and select "Flexible (±3 days)" or "Planning ahead" in the date flexibility field. We can review your inventory and route now, then finalize your time slot once your conveyancer or property manager confirms key handover.',
  },
];
