import type { Metadata } from 'next';
import {
  LegalPage, H2, H3, P, UL, LI, HR, Table, Th, Td, Disclaimer, Strong, A, Code,
} from '../../../components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Security - Querencia',
  robots: { index: false, follow: false }, // hidden until legal entity registration is finalized
};

export default function SecurityPage() {
  return (
    <LegalPage title="Security at Querencia" lastUpdated="[DATE]">
      <H2>{"1. End-to-End Encryption (Cùi Bắp)"}</H2>
      <P>{"Every message you send in Cùi Bắp is encrypted on your device before it ever leaves it, using "}<Strong>{"AES-256-GCM"}</Strong>{", an industry-standard encryption algorithm also used to protect classified government information."}</P>
      <P>{"What this means in practice:"}</P>
      <UL>
      <LI>{"Only you and the person (or group) you're messaging hold the keys to read the message."}</LI>
      <LI>{"Our servers store and route only encrypted ciphertext."}</LI>
      <LI>{"Querencia employees cannot read your Cùi Bắp message content - we simply don't have the keys to do so."}</LI>
      <LI>{"If we ever received a court order demanding your message content, we could not comply with the plaintext, because we do not possess it."}</LI>
      </UL>
      <P>{"Media attachments (photos, files) sent in Cùi Bắp follow the same principle and are automatically deleted from our servers after 30 days unless you've saved them, with a reminder sent 1 day before deletion."}</P>
      <HR/>
      <H2>{"2. Encryption Everywhere Else"}</H2>
      <UL>
      <LI><Strong>{"In transit:"}</Strong>{" all traffic between your device and our servers is encrypted using TLS (HTTPS), the same standard used by banks."}</LI>
      <LI><Strong>{"At rest:"}</Strong>{" data stored in our databases and file storage is encrypted at rest by our infrastructure providers (Supabase, Cloudflare R2)."}</LI>
      <LI><Strong>{"Passwords:"}</Strong>{" if you use email/password sign-in, your password is never stored in plain text. We store only a salted, one-way cryptographic hash, meaning even we cannot see your actual password."}</LI>
      </UL>
      <HR/>
      <H2>{"3. Account Security Features"}</H2>
      <UL>
      <LI><Strong>{"Google Sign-In / Apple Sign-In:"}</Strong>{" recommended for most users, since it relies on Google's or Apple's own strong account security rather than a new password to remember."}</LI>
      <LI><Strong>{"Multi-factor authentication (MFA):"}</Strong>{" available on supported platforms; when enabled, new sign-ins from unrecognized devices require your explicit approval from an already-trusted device."}</LI>
      <LI><Strong>{"Session security:"}</Strong>{" our backend supports revoking all active sessions for an account (for example, if you suspect unauthorized access, contact us and we can force a sign-out on all devices). A self-service session management screen in Settings, where you can view and revoke individual sessions yourself, is planned but not yet available."}</LI>
      <LI><Strong>{"Encrypted local vaults:"}</Strong>{" tools like Secure Notes, Diary, and File Vault use client-side AES-256 encryption with a password only you know - we cannot recover this password if you forget it, precisely because we never receive it."}</LI>
      </UL>
      <HR/>
      <H2>{"4. Payment Security"}</H2>
      <P>{"Querencia never sees or stores your full card number, CVV, or bank account details. All payments are processed by "}<Strong>{"Paddle"}</Strong>{", a PCI-DSS Level 1 certified payment provider (the highest level of payment card industry certification). We receive only confirmation that a payment succeeded and its amount."}</P>
      <HR/>
      <H2>{"5. Infrastructure Security"}</H2>
      <UL>
      <LI>{"Our infrastructure runs on reputable, security-audited providers: "}<Strong>{"Supabase"}</Strong>{" (database), "}<Strong>{"Upstash"}</Strong>{" (caching), "}<Strong>{"Cloudflare R2"}</Strong>{" (file storage), "}<Strong>{"Fly.io"}</Strong>{" and "}<Strong>{"Vercel"}</Strong>{" (hosting)."}</LI>
      <LI>{"Access to production systems is restricted to essential personnel and protected by strong authentication."}</LI>
      <LI>{"We follow the principle of least privilege: employees and systems only get the access they need to do their job."}</LI>
      </UL>
      <HR/>
      <H2>{"6. Vulnerability Reporting"}</H2>
      <P>{"If you believe you've found a security vulnerability in Querencia, please report it responsibly:"}</P>
      <UL>
      <LI><Strong>{"Email:"}</Strong>{" [email protected]"}</LI>
      <LI>{"Please include: a description of the vulnerability, steps to reproduce it, and its potential impact."}</LI>
      <LI>{"Please do not publicly disclose a vulnerability before we've had a reasonable opportunity to investigate and address it."}</LI>
      <LI>{"We commit to acknowledging reports within [X] business days."}</LI>
      </UL>
      <P>{"We are grateful to security researchers who report issues responsibly and will credit you (with your permission) once a fix is released."}</P>
      <HR/>
      <H2>{"7. What We're Still Working On"}</H2>
      <P>{"In the spirit of the same transparency behind Cùi Bắp's encryption, here is what's on our roadmap:"}</P>
      <UL>
      <LI>{"Formal third-party security audit and penetration testing (planned)."}</LI>
      <LI>{"Bug bounty program (planned, pending company registration and budget)."}</LI>
      <LI>{"Public transparency report on data requests received (planned)."}</LI>
      </UL>
      <P>{"We'll update this page as these are completed."}</P>
      <HR/>
      <H2>{"8. Data Breach Notification"}</H2>
      <P>{"In the unlikely event of a data breach affecting your personal information, we commit to:"}</P>
      <UL>
      <LI>{"Notifying affected users without undue delay, and within the timeframe required by applicable law (e.g., 72 hours under GDPR where feasible)."}</LI>
      <LI>{"Notifying relevant regulators where legally required."}</LI>
      <LI>{"Explaining what happened, what data was affected, and what steps we're taking."}</LI>
      </UL>
      <HR/>
      <H2>{"9. Questions"}</H2>
      <P>{"If you have questions about our security practices, contact us at "}<Strong>{"[email protected]"}</Strong>{" or through the "}<A href="/message">{"Message Querencia"}</A>{" page."}</P>
      <HR/>
      <Disclaimer>{"This Security page is a draft prepared for legal and technical review. Before publishing, sections referencing specific certifications (e.g., Paddle's PCI-DSS status) should be verified directly against the provider's current published compliance status, response-time commitments should be finalized with the team, and a qualified security professional should confirm the accuracy of all technical claims."}</Disclaimer>
    </LegalPage>
  );
}
