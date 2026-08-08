import type { Metadata } from 'next';
import {
  LegalPage, H2, H3, P, UL, LI, HR, Table, Th, Td, Disclaimer, Strong, A, Code,
} from '../../../components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Terms of Service - Querencia',
  robots: { index: false, follow: false }, // hidden until legal entity registration is finalized
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="[DATE]">
      <H2>{"1. Eligibility"}</H2>
      <P>{"You must be at least 13 years old (or the minimum age of digital consent in your country, whichever is higher) to use the Services. By using the Services, you confirm that you meet this requirement. If you are under the age of majority in your jurisdiction, you confirm that a parent or legal guardian has reviewed and agreed to these Terms on your behalf where required by law."}</P>
      <HR/>
      <H2>{"2. Your Account"}</H2>
      <UL>
      <LI>{"You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account."}</LI>
      <LI>{"You must provide accurate information when creating your account."}</LI>
      <LI>{"You may sign in using email/password, Google Sign-In, or Apple Sign-In (on supported platforms)."}</LI>
      <LI>{"You may enable multi-factor authentication (MFA) for additional security; if enabled, approving sign-in requests is your responsibility."}</LI>
      <LI>{"Notify us immediately at "}<Strong>{"[email protected]"}</Strong>{" if you suspect unauthorized access to your account."}</LI>
      </UL>
      <P>{"You may delete your account at any time from Settings. Deleting your account removes your profile and associated content, subject to the retention exceptions described in our "}<A href="/pages/privacy">{"Privacy Policy"}</A>{"."}</P>
      <HR/>
      <H2>{"3. Description of the Services"}</H2>
      <P>{"Querencia is a family of free, ad-free products:"}</P>
      <UL>
      <LI><Strong>{"Cùi Bắp"}</Strong>{" - end-to-end encrypted private messaging."}</LI>
      <LI><Strong>{"Nope"}</Strong>{" - a community space for sharing personal experiences."}</LI>
      <LI><Strong>{"LàNo"}</Strong>{" - an AI companion (in active development; see Section 3.1)."}</LI>
      <LI><Strong>{"Tools"}</Strong>{" - a collection of free utilities (PDF, image, text, and productivity tools), some of which offer optional paid features."}</LI>
      <LI><Strong>{"Read"}</Strong>{" - Querencia's editorial content on personal growth and life topics."}</LI>
      </UL>
      <H3>{"3.1 Features under development"}</H3>
      <P>{"Some features referenced in the Services, including certain LàNo functionality and voice/video calling in Cùi Bắp, are under active development and may not yet be available, may be incomplete, or may change substantially before release. We will clearly label features that are not yet available as \"Coming soon\" where possible."}</P>
      <HR/>
      <H2>{"4. Acceptable Use"}</H2>
      <P>{"You agree not to use the Services to:"}</P>
      <UL>
      <LI>{"Violate any applicable law or regulation."}</LI>
      <LI>{"Harass, threaten, defame, or abuse any other user."}</LI>
      <LI>{"Upload or share content that is illegal, obscene, hateful, or that infringes someone else's intellectual property or privacy rights."}</LI>
      <LI>{"Impersonate any person or entity, or misrepresent your affiliation with any person or entity."}</LI>
      <LI>{"Distribute malware, spam, or engage in phishing."}</LI>
      <LI>{"Attempt to gain unauthorized access to our systems, other users' accounts, or the encrypted content of Cùi Bắp messages."}</LI>
      <LI>{"Reverse-engineer, decompile, or attempt to extract the source code of the Services, except where permitted by law."}</LI>
      <LI>{"Use automated means (bots, scrapers) to access the Services in a way that degrades performance for other users or violates rate limits."}</LI>
      <LI>{"Use the Services to train a competing product without our written permission."}</LI>
      </UL>
      <P>{"We reserve the right to suspend or terminate accounts that violate this section, at our reasonable discretion, and to remove content that violates these Terms."}</P>
      <HR/>
      <H2>{"5. User Content"}</H2>
      <H3>{"5.1 Ownership"}</H3>
      <P>{"You retain ownership of the content you create and share on the Services (messages, posts, comments, uploaded files, vocabulary sets, diary entries, etc.). We do not claim ownership over your content."}</P>
      <H3>{"5.2 License to us"}</H3>
      <P>{"To operate the Services, you grant Querencia a limited, non-exclusive, royalty-free license to host, store, transmit, and display your content solely as necessary to provide the Services to you (e.g., delivering your Cùi Bắp messages to their recipient, displaying your Nope post to other users if you chose to publish it publicly). This license ends when you delete the content or your account, except where a copy is retained for a limited period as described in our Privacy Policy (e.g., backups, legal retention)."}</P>
      <H3>{"5.3 Public content"}</H3>
      <P>{"Content you choose to publish publicly (for example, a Nope post marked public) may be viewed, and its associated interactions (thanks, comments) may be seen, by other users or the public depending on your settings. Do not share anything publicly that you are not comfortable being seen by others."}</P>
      <H3>{"5.4 Your responsibility"}</H3>
      <P>{"You are solely responsible for the content you post and for ensuring you have the right to share it. We do not pre-screen content but may remove content that violates these Terms upon notice or discovery."}</P>
      <HR/>
      <H2>{"6. Payments, Q Credits, and Refunds"}</H2>
      <H3>{"6.1 Q credits"}</H3>
      <P>{"\"Q\" is Querencia's virtual in-app credit, used exclusively to unlock optional paid tools and features within the Services. Q has no cash value outside the Services and cannot be redeemed for cash, except as described in our refund policy below."}</P>
      <H3>{"6.2 Pricing"}</H3>
      <P>{"Paid access is billed at a flat rate of $0.50 USD per day, purchasable in 1-day, 7-day, or 30-day increments, at your choice, with no auto-renewal. Each day of access grants 10 Q that expire after 24 hours and 1 Q with no expiration, as described on our "}<A href="/pricing">{"Pricing"}</A>{" page."}</P>
      <H3>{"6.3 Payment processing"}</H3>
      <P>{"All payments are processed by "}<Strong>{"Paddle"}</Strong>{", acting as the authorized reseller and merchant of record for digital purchases made on Querencia. Your purchase is subject to Paddle's own terms and privacy policy in addition to these Terms. Querencia does not store your full payment card details."}</P>
      <H3>{"6.4 Refunds"}</H3>
      <P>{"You may request a refund for any full, unused day(s) remaining in your current access period, calculated at $0.50 USD per unused full day. The day currently in use is non-refundable and will continue until the end of its 24-hour period. Refund transaction fees, if any, are your responsibility. Q already granted for the day in use is non-refundable. To request a refund, contact us via the "}<A href="/message">{"Message Querencia"}</A>{" page or "}<Strong>{"[email protected]"}</Strong>{"."}</P>
      <H3>{"6.5 Gifting Q"}</H3>
      <P>{"You may gift Q to other users or to the community Q Pool. Gifted Q is non-refundable once transferred."}</P>
      <H3>{"6.6 Pricing changes"}</H3>
      <P>{"We may change our pricing at any time. Changes will not affect access periods you have already purchased."}</P>
      <HR/>
      <H2>{"7. Intellectual Property"}</H2>
      <P>{"The Services, including their design, logos, trademarks (\"Querencia,\" \"Cùi Bắp,\" \"Nope,\" \"LàNo\"), and underlying software, are owned by Querencia and protected by intellectual property laws. Except for the limited rights expressly granted to you in these Terms, we reserve all rights."}</P>
      <P>{"You may not use Querencia's trademarks, logos, or brand names without our prior written consent."}</P>
      <HR/>
      <H2>{"8. Third-Party Services"}</H2>
      <P>{"The Services may link to or integrate with third-party services (e.g., Google, Apple, Paddle). We are not responsible for the content, privacy practices, or terms of those third-party services. Your use of them is subject to their own terms."}</P>
      <HR/>
      <H2>{"9. Disclaimers"}</H2>
      <P>{"THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE."}</P>
      <P>{"Tools that process files (e.g., PDF conversion, image editing) are provided for convenience; you are responsible for keeping backups of your original files. LàNo and other AI-assisted features may produce inaccurate or inappropriate output; they are not a substitute for professional medical, legal, financial, or mental health advice."}</P>
      <P>{"If you are experiencing a mental health crisis, please contact your local emergency services or a crisis hotline. LàNo is not a substitute for professional care."}</P>
      <HR/>
      <H2>{"10. Limitation of Liability"}</H2>
      <P>{"TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUERENCIA AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM, OR (B) USD 50."}</P>
      <P>{"Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you."}</P>
      <HR/>
      <H2>{"11. Indemnification"}</H2>
      <P>{"You agree to indemnify and hold Querencia harmless from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from your violation of these Terms or your misuse of the Services."}</P>
      <HR/>
      <H2>{"12. Termination"}</H2>
      <P>{"You may stop using the Services and delete your account at any time. We may suspend or terminate your access to the Services if you violate these Terms, if required by law, or if we discontinue the Services (with reasonable notice where practicable). Sections of these Terms that by their nature should survive termination (e.g., ownership, disclaimers, limitation of liability) will survive."}</P>
      <HR/>
      <H2>{"13. Changes to the Services"}</H2>
      <P>{"We may modify, suspend, or discontinue any part of the Services at any time. We will make reasonable efforts to notify users of material changes affecting paid features."}</P>
      <HR/>
      <H2>{"14. Changes to These Terms"}</H2>
      <P>{"We may update these Terms from time to time. If we make material changes, we will notify you by email or an in-app notice before the changes take effect. Continued use of the Services after changes take effect constitutes acceptance of the updated Terms."}</P>
      <HR/>
      <H2>{"15. Governing Law and Dispute Resolution"}</H2>
      <P>{"These Terms are governed by the laws of [JURISDICTION], without regard to its conflict-of-law principles. Any dispute arising from these Terms or the Services will be resolved in the courts of [JURISDICTION], except where applicable consumer protection law in your country of residence grants you the right to bring a claim in your local courts."}</P>
      <P>{"If you are a consumer resident in the EU or UK, nothing in this section deprives you of the protection afforded by mandatory provisions of the law of your country of residence."}</P>
      <HR/>
      <H2>{"16. Miscellaneous"}</H2>
      <UL>
      <LI><Strong>{"Entire agreement:"}</Strong>{" these Terms, together with our Privacy Policy, constitute the entire agreement between you and Querencia regarding the Services."}</LI>
      <LI><Strong>{"Severability:"}</Strong>{" if any provision of these Terms is found unenforceable, the remaining provisions remain in full effect."}</LI>
      <LI><Strong>{"No waiver:"}</Strong>{" our failure to enforce any right or provision is not a waiver of that right."}</LI>
      <LI><Strong>{"Assignment:"}</Strong>{" you may not assign these Terms; we may assign them in connection with a merger, acquisition, or sale of assets."}</LI>
      </UL>
      <HR/>
      <H2>{"17. Contact Us"}</H2>
      <UL>
      <LI><Strong>{"Email:"}</Strong>{" [email protected]"}</LI>
      <LI><Strong>{"In-app:"}</Strong>{" "}<A href="/message">{"Message Querencia"}</A></LI>
      </UL>
      <HR/>
      <Disclaimer>{"These Terms of Service are a draft prepared for legal review. Before publishing, they should be reviewed by a qualified attorney, particularly regarding: (1) the governing law and jurisdiction most appropriate once the company is formally registered, (2) enforceability of the liability limitation across all target markets, (3) consumer protection law compliance for EU/UK/other consumer-protective jurisdictions, and (4) refund policy compliance with each region's distance-selling and digital goods regulations. All bracketed placeholders should be filled in with final, verified details."}</Disclaimer>
    </LegalPage>
  );
}
