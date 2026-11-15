import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Phone,
  MapPin,
  UserRound,
  Truck,
  BadgeDollarSign,
  PackageCheck,
  Home,
  Building2,
  BriefcaseBusiness,
  Sofa,
  Package,
  MoveUpRight,
  Check,
  CalendarCheck,
  ClipboardList,
  CheckCircle2,
  Plus,
  Mail,
} from "lucide-react";
import { mrkBusiness, getMandatoryRateDisclaimer } from "../config/business";
import { MRK_SERVICES } from "../content/services";
import { MRK_SERVICE_AREAS } from "../content/service-areas";
import { MRK_FAQS } from "../content/faqs";
import { QuoteForm, SIZE_NOT_SELECTED } from "../components/forms/QuoteForm";
import { MoveScopeBuilder } from "../components/interactive/MoveScopeBuilder";
import { ResponsiveImage } from "../components/ui/ResponsiveImage";
import { useReducedMotion } from "../lib/useReducedMotion";

const photos = Object.fromEntries(
  Object.entries(mrkBusiness.photographyAssets).map(([key, value]) => [
    key,
    value.replace("/photography/", "/photography/cinematic/"),
  ]),
) as typeof mrkBusiness.photographyAssets;
const features = [
  {
    icon: UserRound,
    title: "Direct owner communication",
    body: "One conversation. A move planned around you.",
  },
  {
    icon: Truck,
    title: "House, apartment & office moves",
    body: "Thoughtful planning for your next chapter.",
  },
  {
    icon: BadgeDollarSign,
    title: "Clear indicative pricing",
    body: "Understand your quote before you confirm.",
  },
  {
    icon: PackageCheck,
    title: "Care in every detail",
    body: "From access planning to furniture handling.",
  },
];
const editorials = [
  {
    slug: "house-removals",
    icon: Home,
    label: "House removals",
    title: "A fresh start.\nHandled with care.",
    body: "Your home is more than a collection of boxes. Move across Adelaide with careful preparation, considered loading and furniture protection.",
    image: photos.professionalWrapping,
    alt: "Residential moving scene showing protective furniture wrapping",
    points: [
      "Furniture protection and considered loading",
      "Access and parking planned ahead",
      "Clear communication from start to finish",
    ],
    cta: "Get a House Move Quote",
  },
  {
    slug: "apartment-strata-moves",
    icon: Building2,
    label: "Apartment & strata moves",
    title: "Every floor.\nEvery detail considered.",
    body: "Tight corners, shared spaces and booked lifts. We help you plan the details that make an apartment move run smoothly.",
    image: photos.apartmentRelocation,
    alt: "Apartment relocation scene with wrapped furniture near a service lift",
    points: [
      "Strata and building access coordination",
      "Careful planning for lifts and stairs",
      "Timing discussed around building requirements",
    ],
    cta: "Get an Apartment Move Quote",
  },
  {
    slug: "office-commercial-relocations",
    icon: BriefcaseBusiness,
    label: "Office relocations",
    title: "New workspace.\nSame momentum.",
    body: "Give your business a considered move. Plan equipment, furniture and access together, with a clear sequence for your relocation.",
    image: photos.officeRelocation,
    alt: "Professional office relocation scene with packed equipment and furniture",
    points: [
      "A move sequence built around your business",
      "Careful handling of furniture and equipment",
      "Access and arrival windows agreed in advance",
    ],
    cta: "Get an Office Move Quote",
  },
];
const steps = [
  {
    icon: ClipboardList,
    title: "Request Your Quote",
    body: "Tell us where you’re going, what’s moving and when.",
  },
  {
    icon: CalendarCheck,
    title: "Review & Plan",
    body: "Discuss access, your inventory and the right moving approach.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm Your Move",
    body: "Review your quoted inclusions, charges and date.",
  },
  {
    icon: Truck,
    title: "Moving Day",
    body: "Your agreed plan comes together, one careful load at a time.",
  },
];

export const HomePage: React.FC<{ onNavigate: (path: string) => void }> = ({
  onNavigate,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const quote = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [area, setArea] = useState(0);
  const [faq, setFaq] = useState("");
  const [inventory, setInventory] = useState(false);
  const [size, setSize] = useState(SIZE_NOT_SELECTED);
  const [notes, setNotes] = useState("");
  const [service, setService] = useState("house-removals");
  const scrollToQuote = (slug?: string) => {
    if (slug) setService(slug);
    quote.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    onNavigate(path);
  };
  useEffect(() => {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    // Content is visible by default. The observer adds a finite entrance only as it enters.
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cinema-enter");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduceMotion]);
  useEffect(() => {
    if (reduceMotion || !matchMedia("(pointer:fine)").matches) return;
    const element = hero.current;
    if (!element) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty(
          "--depth-x",
          `${(event.clientX / window.innerWidth - 0.5) * 10}px`,
        );
        element.style.setProperty(
          "--depth-y",
          `${(event.clientY / element.offsetHeight - 0.5) * 6}px`,
        );
      });
    };
    const reset = () => {
      element.style.setProperty("--depth-x", "0px");
      element.style.setProperty("--depth-y", "0px");
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
    };
  }, [reduceMotion]);
  const selectedArea = MRK_SERVICE_AREAS[area];
  return (
    <div className="cinema-home" ref={root}>
      <section
        className="cinema-hero"
        ref={hero}
        aria-labelledby="hero-heading"
      >
        <div className="hero-art">
          <ResponsiveImage
            src={photos.heroTruckCinematic}
            mobileSrc={photos.heroTruckMobile}
            mobileSizes="(max-width: 527px) 540px, 100vw"
            alt="MRK branded truck in an Adelaide moving scene"
            priority
            sizes="100vw"
            width={1672}
            height={941}
          />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-trail" aria-hidden="true" />
        <div className="cinema-wrap hero-content">
          <p className="cinema-eyebrow hero-eyebrow mrk-rise">
            MRK REMOVALS ADELAIDE <span />
          </p>
          <h1 id="hero-heading" className="mrk-rise">
            Adelaide removalists,
            <br />
            <em>planned with precision.</em>
          </h1>
          <p className="hero-description mrk-rise">
            House, apartment and office moves across Adelaide, South Australia.
            A considered move, coordinated directly with Moe.
          </p>
          <div className="cinema-actions mrk-rise">
            <button
              className="cinema-button btn-ruby"
              onClick={() => scrollToQuote()}
            >
              Get a Free Quote <ArrowRight size={19} />
            </button>
            <a
              className="cinema-button cinema-outline"
              href={mrkBusiness.phoneHref}
            >
              <Phone size={18} /> Call {mrkBusiness.phoneDisplay}
            </a>
          </div>
          <div className="hero-details mrk-rise">
            <span>
              <UserRound /> Direct with Moe
              <br />
              Owner communication
            </span>
            <span>
              <BadgeDollarSign /> Honest, clear
              <br />
              indicative pricing
            </span>
            <span>
              <MapPin /> Across Adelaide,
              <br />
              South Australia
            </span>
          </div>
        </div>
        <div className="hero-caption" aria-hidden="true">
          YOUR NEXT CHAPTER STARTS HERE <span>01 / ADELAIDE</span>
        </div>
      </section>

      <div className="cinema-wrap trust-grid" aria-label="Moving with MRK">
        {features.map(({ icon: Icon, title, body }, index) => (
          <article
            key={title}
            className="trust-tile"
            data-reveal
            style={{ "--stagger": `${index * 70}ms` } as React.CSSProperties}
          >
            <Icon aria-hidden="true" />
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="cinema-wrap editorial-sections">
        {editorials.map(({ icon: Icon, ...item }, index) => (
          <section
            className={`cinema-editorial editorial-${index + 1}`}
            key={item.slug}
            aria-labelledby={`heading-${item.slug}`}
          >
            <div className="editorial-image" data-reveal>
              <ResponsiveImage
                src={item.image}
                alt={item.alt}
                sizes="(min-width: 900px) 48vw, 100vw"
              />
              <span className="image-edge" aria-hidden="true" />
              <span className="image-number" aria-hidden="true">
                0{index + 1} <span> / MOVING, CONSIDERED.</span>
              </span>
            </div>
            <div className="editorial-copy" data-reveal>
              <p className="service-kicker">
                <Icon size={18} />
                {item.label}
              </p>
              <h2 id={`heading-${item.slug}`}>
                {item.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{item.body}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>
                    <Check size={18} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="cinema-actions">
                <button
                  className="cinema-button btn-ruby"
                  onClick={() => scrollToQuote(item.slug)}
                >
                  {item.cta}
                  <ArrowRight size={17} />
                </button>
                <a
                  href={`/services/${item.slug}`}
                  onClick={go(`/services/${item.slug}`)}
                  className="cinema-detail"
                >
                  Explore service <MoveUpRight size={16} />
                  <span className="sr-only">: {item.label}</span>
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section
        className="cinema-wrap specialist-section"
        aria-labelledby="specialist-heading"
      >
        <div className="section-heading" data-reveal>
          <p className="cinema-eyebrow">THE DETAILS MAKE THE DIFFERENCE</p>
          <h2 id="specialist-heading">
            A little extra help.
            <br className="mobile-break" /> A better move.
          </h2>
        </div>
        <div className="specialist-grid">
          {MRK_SERVICES.filter(
            (s) => !editorials.some((e) => e.slug === s.slug),
          ).map((item, index) => {
            const Icon = [Sofa, Package, PackageCheck][index % 3];
            return (
              <a
                key={item.slug}
                className="specialist-card"
                href={`/services/${item.slug}`}
                onClick={go(`/services/${item.slug}`)}
                data-reveal
                style={
                  { "--stagger": `${index * 80}ms` } as React.CSSProperties
                }
              >
                <Icon size={34} />
                <h3>{item.shortTitle}</h3>
                <p>{item.summary}</p>
                <span className="specialist-arrow">
                  <ArrowRight size={20} />
                  <span className="sr-only">Explore {item.shortTitle}</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section
        className="cinema-wrap pricing-section"
        aria-labelledby="pricing-heading"
        data-reveal
      >
        <div className="pricing-scene">
          <ResponsiveImage
            src={photos.adelaideSkylineTwilight}
            alt=""
            sizes="100vw"
          />
        </div>
        <div className="pricing-copy">
          <p className="cinema-eyebrow">HONEST PRICING</p>
          <h2 id="pricing-heading">Clear from the start.</h2>
          <p className="cinema-rate">
            $130–$135<span>/hr</span>
          </p>
          <p className="rate-label">Indicative hourly rates · GST included</p>
          <p>{getMandatoryRateDisclaimer()}</p>
          <a className="cinema-detail" href="/pricing" onClick={go("/pricing")}>
            Understand your moving quote <ArrowRight size={18} />
          </a>
        </div>
        <div className="pricing-panel">
          <h3>Your quote, explained.</h3>
          <ul>
            <li>
              <CheckCircle2 />
              GST included in the hourly rate
            </li>
            <li>
              <CheckCircle2 />
              3-hour minimum
            </li>
            <li>
              <CheckCircle2 />
              Plus a 1-hour call-out fee
            </li>
            <li>
              <CheckCircle2 />
              Truck and crew confirmed for your move
            </li>
            <li>
              <CheckCircle2 />
              Other charges and inclusions agreed in your quote
            </li>
          </ul>
          <p>
            Every move is different. Confirm your individual quote before
            booking.
          </p>
        </div>
      </section>

      <section
        className="cinema-wrap process-section"
        aria-labelledby="process-heading"
      >
        <div className="section-heading" data-reveal>
          <p className="cinema-eyebrow">THE PROCESS</p>
          <h2 id="process-heading">Your next chapter, in four steps.</h2>
        </div>
        <div className="process-grid">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <article
              className="process-step"
              key={title}
              data-reveal
              style={{ "--stagger": `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="step-top">
                <Icon size={30} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              {index < 3 && (
                <ArrowRight className="step-connector" aria-hidden="true" />
              )}
            </article>
          ))}
        </div>
      </section>

      <section
        className="cinema-wrap quote-section"
        id="quote-section"
        ref={quote}
        aria-labelledby="quote-heading"
      >
        <div className="quote-story">
          <ResponsiveImage
            src={photos.adelaideSkylineTwilight}
            alt=""
            sizes="(min-width: 900px) 35vw, 100vw"
          />
          <div>
            <p className="cinema-eyebrow">LET’S PLAN YOUR MOVE</p>
            <h2 id="quote-heading">
              A good move
              <br />
              starts with a<br />
              <em>conversation.</em>
            </h2>
            <p>
              Tell us about your next chapter. Get a tailored quote for your
              house, apartment or office move in Adelaide.
            </p>
            <ul className="quote-contacts">
              <li>
                <UserRound />
                <span>
                  Direct with Moe
                  <br />
                  <small>Owner communication</small>
                </span>
              </li>
              <li>
                <Phone />
                <a href={mrkBusiness.phoneHref}>{mrkBusiness.phoneDisplay}</a>
              </li>
              <li>
                <Mail />
                <a href={mrkBusiness.enquiryEmailHref}>
                  {mrkBusiness.enquiryEmail}
                </a>
              </li>
              <li>
                <MapPin />
                {mrkBusiness.locationLabel}
              </li>
            </ul>
          </div>
        </div>
        <div className="quote-form-surface">
          <p className="service-kicker">YOUR MOVE, YOUR DETAILS</p>
          <h3>Request your free quote</h3>
          <p className="quote-intro">
            No obligation. Just the details we need to plan properly.
          </p>
          <QuoteForm
            initialServiceType={service}
            initialEstimatedSize={size}
            initialInventoryNotes={notes}
            compactHeader
          />
        </div>
      </section>

      <section
        className="cinema-wrap coverage-section"
        aria-labelledby="coverage-heading"
      >
        <div className="coverage-heading" data-reveal>
          <div>
            <p className="cinema-eyebrow">LOCAL KNOWLEDGE. CONSIDERED MOVES.</p>
            <h2 id="coverage-heading">At home across Adelaide.</h2>
          </div>
          <a
            className="cinema-detail"
            href="/service-areas"
            onClick={go("/service-areas")}
          >
            Explore all areas <ArrowRight size={18} />
          </a>
        </div>
        <div
          className="area-pills"
          role="tablist"
          aria-label="Adelaide service areas"
        >
          {MRK_SERVICE_AREAS.map((item, index) => (
            <button
              key={item.slug}
              id={`area-tab-${index}`}
              role="tab"
              aria-selected={area === index}
              aria-controls="area-panel"
              tabIndex={area === index ? 0 : -1}
              onClick={() => setArea(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight")
                  next = (index + 1) % MRK_SERVICE_AREAS.length;
                else if (event.key === "ArrowLeft")
                  next =
                    (index - 1 + MRK_SERVICE_AREAS.length) %
                    MRK_SERVICE_AREAS.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End")
                  next = MRK_SERVICE_AREAS.length - 1;
                else return;
                event.preventDefault();
                setArea(next);
                document.getElementById(`area-tab-${next}`)?.focus();
              }}
            >
              {item.regionGroup}
            </button>
          ))}
        </div>
        <div
          id="area-panel"
          role="tabpanel"
          aria-labelledby={`area-tab-${area}`}
          tabIndex={0}
          className="area-panel"
        >
          <ResponsiveImage
            src={photos.adelaideSkylineTwilight}
            alt="Adelaide streets at twilight"
            sizes="(min-width: 768px) 25vw, 100vw"
          />
          <div key={selectedArea.slug} className="area-copy">
            <h3>
              <MapPin size={18} />
              {selectedArea.title}
            </h3>
            <p>{selectedArea.summary}</p>
            <p className="area-suburbs">
              {selectedArea.keySuburbs.slice(0, 5).join(" · ")}
            </p>
          </div>
          <a
            className="cinema-detail"
            href={`/service-areas/${selectedArea.slug}`}
            onClick={go(`/service-areas/${selectedArea.slug}`)}
          >
            Moving in this area <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="cinema-wrap inventory-section">
        <button
          className="inventory-toggle"
          aria-expanded={inventory}
          aria-controls="move-inventory"
          onClick={() => setInventory(!inventory)}
        >
          <Package size={22} />
          <span>
            Add an item list for a more accurate quote
            <small>
              Optional · Plan your furniture and access requirements
            </small>
          </span>
          <Plus className={inventory ? "rotate-45" : ""} />
        </button>
        <div id="move-inventory" hidden={!inventory}>
          {inventory && (
            <MoveScopeBuilder
              onApplyScopeToQuote={(summary, label) => {
                setNotes(summary);
                setSize(label);
                scrollToQuote();
              }}
            />
          )}
        </div>
      </section>

      <section
        className="cinema-wrap faq-section"
        aria-labelledby="faq-heading"
      >
        <div className="section-heading" data-reveal>
          <p className="cinema-eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p>
          <h2 id="faq-heading">Good questions. Clear answers.</h2>
        </div>
        <div className="cinema-faqs">
          {MRK_FAQS.map((item) => (
            <article
              key={item.id}
              className={faq === item.id ? "faq-open" : ""}
            >
              <h3>
                <button
                  aria-expanded={faq === item.id}
                  aria-controls={`answer-${item.id}`}
                  id={`question-${item.id}`}
                  onClick={() => setFaq(faq === item.id ? "" : item.id)}
                >
                  {item.question}
                  <Plus size={20} />
                </button>
              </h3>
              <div
                id={`answer-${item.id}`}
                role="region"
                aria-labelledby={`question-${item.id}`}
                className="faq-answer"
                inert={faq !== item.id}
              >
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <a className="cinema-detail faq-all" href="/faq" onClick={go("/faq")}>
          View all frequently asked questions <ArrowRight size={18} />
        </a>
      </section>

      <section
        className="cinema-wrap closing-section"
        aria-labelledby="closing-heading"
      >
        <ResponsiveImage
          src={photos.heroTruckCinematic}
          alt="MRK branded moving truck"
          sizes="100vw"
        />
        <div className="closing-copy">
          <p className="cinema-eyebrow">LET’S MAKE YOUR NEXT MOVE</p>
          <h2 id="closing-heading">Ready to plan your move?</h2>
          <p>A clear plan. A careful move. Your next chapter starts here.</p>
          <div className="cinema-actions">
            <button
              className="cinema-button btn-ruby"
              onClick={() => scrollToQuote()}
            >
              Request a Free Quote <ArrowRight size={18} />
            </button>
            <a
              className="cinema-button cinema-outline"
              href={mrkBusiness.phoneHref}
            >
              <Phone size={18} />
              Call {mrkBusiness.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
