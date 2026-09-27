import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

interface Props {
  adminMode?: boolean;
}

const serviceLinks = ['Door-to-door moves', 'Air freight', 'Sea freight', 'Customs clearance', 'Pet relocation', 'Settling-in services'];
const companyLinks = ['About', 'Press', 'Careers', 'Partners', 'Insurance'];
const accreditations = [
  { label: 'FIDI', full: 'FIDI Accredited International Mover' },
  { label: 'IAM', full: 'International Association of Movers' },
  { label: 'FMC', full: 'Federal Maritime Commission Licensed' },
  { label: 'BAR', full: 'British Association of Removers' },
];

export default function Footer({ adminMode = false }: Props) {
  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Services */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-light mb-5">
              <EditableText id="footer.col1.title" defaultText="Services" adminMode={adminMode} />
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-ivory/50 hover:text-gold-light transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-light mb-5">
              <EditableText id="footer.col2.title" defaultText="Company" adminMode={adminMode} />
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-ivory/50 hover:text-gold-light transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-light mb-5">
              <EditableText id="footer.col3.title" defaultText="Headquarters" adminMode={adminMode} />
            </h3>
            <address className="text-sm text-ivory/50 not-italic leading-relaxed">
              <EditableText id="footer.address.a" defaultText="10 Anson Road, #21-08" adminMode={adminMode} /><br />
              <EditableText id="footer.address.b" defaultText="International Plaza" adminMode={adminMode} /><br />
              <EditableText id="footer.address.c" defaultText="Singapore 079903" adminMode={adminMode} />
            </address>
            <div className="mt-5 space-y-3">
              <a href="tel:+6565201914" className="flex items-center gap-2.5 text-sm text-ivory/50 hover:text-gold-light transition-colors">
                <span className="w-7 h-7 rounded-lg bg-ivory/10 text-gold-light flex items-center justify-center flex-shrink-0"><Icon name="phone" size={13} /></span>
                <EditableText id="footer.phone" defaultText="+65 6520 1914" adminMode={adminMode} />
              </a>
              <a href="mailto:contact@apacrelocation.com" className="flex items-center gap-2.5 text-sm text-ivory/50 hover:text-gold-light transition-colors break-all">
                <span className="w-7 h-7 rounded-lg bg-ivory/10 text-gold-light flex items-center justify-center flex-shrink-0"><Icon name="mail" size={13} /></span>
                <EditableText id="footer.email" defaultText="contact@apacrelocation.com" adminMode={adminMode} />
              </a>
            </div>
          </div>

          {/* Brand & CTA */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
                <span className="font-display text-ink text-xs">AP</span>
              </div>
              <span className="font-display text-lg">APAC <span className="italic gold-text">Relocation</span></span>
            </div>
            <p className="text-sm text-ivory/50 mb-6 leading-relaxed">
              <EditableText id="footer.tagline" defaultText="Premium door-to-door international relocation from Singapore to the United States." adminMode={adminMode} multiline />
            </p>
            <a href="#quote" className="inline-flex items-center gap-2 px-6 py-3 gradient-gold text-ink font-semibold rounded-full hover:opacity-90 transition-all text-sm">
              <EditableText id="footer.cta" defaultText="Get Instant Quote" adminMode={adminMode} />
              <Icon name="arrowRight" size={14} />
            </a>
          </div>
        </div>

        {/* Accreditation Badges */}
        <div className="mt-14 pt-8 border-t border-ivory/10">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {accreditations.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-ivory/15 text-xs text-ivory/60" title={badge.full}>
                <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-[8px] font-bold text-ink">
                  {badge.label.slice(0, 3)}
                </div>
                <span className="hidden sm:inline">{badge.full}</span>
                <span className="sm:hidden">{badge.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-ivory/40">
            <EditableText id="footer.copyright" defaultText={`© ${new Date().getFullYear()} APAC Relocation Pte Ltd. All rights reserved. FMC OTI License #028XXX-NF`} adminMode={adminMode} />
          </div>
        </div>
      </div>
    </footer>
  );
}
