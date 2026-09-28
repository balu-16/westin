import { MessageCircle, Phone } from "lucide-react";

/** Both official Vijayawada contact pages list this number. */
const contact = {
  telephone: "tel:+919393755755",
  whatsapp: "https://api.whatsapp.com/send?phone=919393755755",
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
