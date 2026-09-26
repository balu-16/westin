import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicPageHero } from "./PublicPageHero";
import { sources } from "./content";

/** Both official Vijayawada contact pages list this number. */
const contact = {
  telephone: "tel:+919393755755",
  email: "mailto:vijayawada@westin.ac.in",
  whatsapp: "https://api.whatsapp.com/send?phone=919393755755",
  official: "https://www.westincolleges.com/vij/contact.html",
};

export function ContactActions() {
  return (
    <div className="sk-actions">
      <a className="sk-button" href={contact.telephone}>
        <Phone size={17} aria-hidden="true" />
        Call the college
      </a>
      <a
        className="sk-button sk-button-outline"
        href={contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Chat on WhatsApp<span className="sr-only"> (opens a new tab)</span>
      </a>
    </div>
  );
}

export function ContactHandoff({ visit = false }: { visit?: boolean }) {
  return (
    <>
      <PublicPageHero
        kind={visit ? "admissions" : "contact"}
        eyebrow={visit ? "Come get a feel for your next chapter" : "Let’s start a conversation"}
        title={visit ? "Picture yourself here." : "Good questions. Warm welcomes."}
        summary={visit
          ? "Talk to the Vijayawada team about visiting the college, exploring a program and finding your next step."
          : "Speak with the Vijayawada team about programs, admissions or a campus visit."}
      />
      <section
        className="sk-contact-page sk-container sk-section"
        id={visit ? "visit" : "contact-details"}
      >
        <ContactActions />
        <div className="sk-contact-details">
          <div>
            <span className="sk-eyebrow">Vijayawada campus</span>
            <p><Phone size={18} aria-hidden="true" /> <a href={contact.telephone}>+91 93 93 755 755</a></p>
            <p><Mail size={18} aria-hidden="true" /> <a href={contact.email}>vijayawada@westin.ac.in</a></p>
            <p><MapPin size={18} aria-hidden="true" /> G V R Towers, Bharathi Nagar, opposite Vinayak Theatre, Vijayawada, Andhra Pradesh 520008</p>
          </div>
          <div>
            <p>
              Westin lists business, hospitality and MEC/CEC intermediate study in Vijayawada. Call or email the college to discuss courses, eligibility, fees and a campus visit.
            </p>
            <a
              href={contact.official}
              target="_blank"
              rel="noopener noreferrer"
              className="sk-text-link"
            >
              Official contact details{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only"> (opens a new tab)</span>
            </a>
            <a href={sources.contact} target="_blank" rel="noopener noreferrer" className="sk-text-link">
              Newer college contact page <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span>
            </a>
          </div>
        </div>
        {visit && <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Explore programs", "Compare degrees, diplomas and MEC/CEC streams before your visit."],
            ["02", "Discuss your entry route", "Each course page lists Westin’s stated educational requirements."],
            ["03", "See the campus", "Ask the Vijayawada team about a visit and practical learning spaces."],
          ].map(([number, title, detail]) => <div key={number} className="rounded-[24px] border border-[#cce7f7] bg-white p-6">
            <span className="text-xs font-bold text-[#1468aa]">{number}</span>
            <h2 className="mt-3 text-xl font-bold text-[#142d46]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#42647a]">{detail}</p>
          </div>)}
        </div>}
        <Link to="/programs" className="sk-text-link">
          Explore your study pathways{" "}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
