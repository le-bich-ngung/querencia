import type { Metadata } from 'next';
import {
  LegalPage, H2, H3, P, UL, LI, HR, Table, Th, Td, Disclaimer, Strong, A, Code,
} from '../../../components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Privacy Policy - Querencia',
  robots: { index: false, follow: false }, // hidden until legal entity registration is finalized
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="[DATE]">
      <H2>{"1. Who We Are"}</H2>
      <P>{"Querencia is operated by [LEGAL ENTITY NAME], a company registered in [JURISDICTION] (\"we,\" \"us\"). For any privacy questions, contact us at "}<Strong>{"[email protected]"}</Strong>{" or through the "}<A href="/message">{"Message Querencia"}</A>{" page in the app."}</P>
      <P>{"If we appoint a Data Protection Officer or an EU/UK representative in the future, their contact details will be published on this page."}</P>
      <HR/>
      <H2>{"2. Information We Collect"}</H2>
      <P>{"We only collect what we need to run the Services. We group it into three categories:"}</P>
      <H3>{"2.1 Information you give us directly"}</H3>
      <UL>
      <LI><Strong>{"Account information:"}</Strong>{" name, email address, and profile photo, either entered manually or provided by Google Sign-In / Apple Sign-In when you register."}</LI>
      <LI><Strong>{"Content you create:"}</Strong>{" messages you send in Cùi Bắp, posts and comments you publish in Nope, vocabulary sets you upload to Tools, diary entries, notes, and any other content you input into the Services."}</LI>
      <LI><Strong>{"Payment information:"}</Strong>{" when you buy Q (our in-app credit), payments are processed by "}<Strong>{"Paddle"}</Strong>{", our payment provider. Querencia does not receive or store your full card number, CVV, or bank details - Paddle handles this as the merchant of record. We only receive confirmation of payment and the amount."}</LI>
      <LI><Strong>{"Communications:"}</Strong>{" messages you send us through the Message page, support requests, or feedback forms."}</LI>
      </UL>
      <H3>{"2.2 Information collected automatically"}</H3>
      <UL>
      <LI><Strong>{"Usage data:"}</Strong>{" pages visited, tools used, features accessed, session duration, and general interaction patterns, used to keep the Services reliable and to improve them."}</LI>
      <LI><Strong>{"Device and log data:"}</Strong>{" IP address, browser type, operating system, device identifiers, and crash logs, used for security, debugging, and fraud prevention."}</LI>
      <LI><Strong>{"Cookies and similar technologies:"}</Strong>{" see Section 8 (Cookies) below."}</LI>
      </UL>
      <H3>{"2.3 Information we do "}<Strong>{"not"}</Strong>{" collect"}</H3>
      <UL>
      <LI>{"We do not collect precise GPS location unless a specific tool (e.g., the IP Lookup tool) requires it, and even then only with your action."}</LI>
      <LI>{"We do not read the plaintext content of end-to-end encrypted (E2EE) Cùi Bắp messages. See Section 4 for details on how E2EE works."}</LI>
      <LI>{"We do not buy data about you from data brokers."}</LI>
      </UL>
      <HR/>
      <H2>{"3. How We Use Your Information"}</H2>
      <P>{"We use the information above only for the following purposes:"}</P>
      <Table><thead><tr><Th>{"Purpose"}</Th><Th>{"Examples"}</Th></tr></thead><tbody><tr><Td>{"Provide the Services"}</Td><Td>{"Creating your account, syncing messages across devices, showing your Nope feed"}</Td></tr><tr><Td>{"Process payments"}</Td><Td>{"Fulfilling Q purchases, calculating refunds"}</Td></tr><tr><Td>{"Maintain security"}</Td><Td>{"Detecting fraud, abuse, or unauthorized access; enforcing our Terms of Service"}</Td></tr><tr><Td>{"Communicate with you"}</Td><Td>{"Responding to support requests, sending essential service notices (e.g., password reset, security alerts)"}</Td></tr><tr><Td>{"Improve the Services"}</Td><Td>{"Understanding aggregate usage patterns to fix bugs and prioritize features"}</Td></tr><tr><Td>{"Comply with the law"}</Td><Td>{"Responding to lawful requests from courts or regulators"}</Td></tr></tbody></Table>
      <P>{"We do "}<Strong>{"not"}</Strong>{" use your information to:"}</P>
      <UL>
      <LI>{"Sell it to third parties."}</LI>
      <LI>{"Share it with advertisers or ad networks (Querencia has no advertising)."}</LI>
      <LI>{"Build advertising profiles about you."}</LI>
      <LI>{"Train third-party AI models on your private messages without your explicit, separate consent."}</LI>
      </UL>
      <H3>{"3.1 Legal basis for processing (EEA / UK users)"}</H3>
      <P>{"If you are located in the European Economic Area or the United Kingdom, we process your personal data under the following legal bases (GDPR Art. 6):"}</P>
      <UL>
      <LI><Strong>{"Contract"}</Strong>{" - to provide the Services you signed up for."}</LI>
      <LI><Strong>{"Legitimate interest"}</Strong>{" - to secure the Services and prevent fraud, balanced against your rights."}</LI>
      <LI><Strong>{"Consent"}</Strong>{" - for optional cookies and any optional feature that explicitly asks for your permission."}</LI>
      <LI><Strong>{"Legal obligation"}</Strong>{" - where we must retain or disclose data to comply with the law."}</LI>
      </UL>
      <HR/>
      <H2>{"4. End-to-End Encryption in Cùi Bắp"}</H2>
      <P>{"Cùi Bắp messages are encrypted end-to-end using AES-256-GCM. This means:"}</P>
      <UL>
      <LI>{"Message content is encrypted on your device before it is sent."}</LI>
      <LI>{"Our servers store only the encrypted ciphertext - we do not have the keys needed to read it."}</LI>
      <LI>{"Even if compelled by a court order, we cannot hand over the plaintext content of E2EE messages, because we do not possess it."}</LI>
      </UL>
      <P>{"Metadata (who you messaged, when, and message size) is not end-to-end encrypted, because it is needed to route and deliver messages. We protect this metadata using access controls and encryption at rest, and we minimize how long we retain it (see Section 7)."}</P>
      <HR/>
      <H2>{"5. Sharing Your Information"}</H2>
      <P>{"We do not sell your personal information. We share it only in these limited circumstances:"}</P>
      <UL>
      <LI><Strong>{"Service providers"}</Strong>{" who process data on our behalf under contract, strictly to help us run the Services:"}</LI>
      <LI><Strong>{"Supabase"}</Strong>{" (PostgreSQL database hosting)"}</LI>
      <LI><Strong>{"Upstash"}</Strong>{" (Redis caching)"}</LI>
      <LI><Strong>{"Cloudflare R2"}</Strong>{" (file and media storage)"}</LI>
      <LI><Strong>{"Paddle"}</Strong>{" (payment processing)"}</LI>
      <LI><Strong>{"Fly.io"}</Strong>{" and "}<Strong>{"Vercel"}</Strong>{" (application hosting)"}</LI>
      <LI><Strong>{"Google"}</Strong>{" and "}<Strong>{"Apple"}</Strong>{" (Sign-In authentication, if you choose those options)"}</LI>
      </UL>
      <P>{"Each provider is contractually restricted from using your data for any purpose other than providing services to us."}</P>
      <UL>
      <LI><Strong>{"Legal requirements:"}</Strong>{" we may disclose information if required by law, subpoena, or court order, or to protect the rights, property, or safety of Querencia, our users, or the public. Where legally possible, we will notify you before disclosure."}</LI>
      </UL>
      <UL>
      <LI><Strong>{"Business transfers:"}</Strong>{" if Querencia is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy."}</LI>
      </UL>
      <UL>
      <LI><Strong>{"With your direction:"}</Strong>{" for example, when you use Nope to publish content publicly, or when you gift Q to another user."}</LI>
      </UL>
      <HR/>
      <H2>{"6. International Data Transfers"}</H2>
      <P>{"Querencia's infrastructure providers operate globally. If you are located in the EEA, UK, or another region with data transfer restrictions, your information may be transferred to and processed in countries that may not have the same data protection laws as your home country. Where this occurs, we rely on appropriate safeguards, such as Standard Contractual Clauses (SCCs), or the provider's own certified compliance frameworks, to protect your data."}</P>
      <HR/>
      <H2>{"7. Data Retention"}</H2>
      <P>{"We keep personal data only as long as necessary for the purposes described in this policy:"}</P>
      <UL>
      <LI><Strong>{"Account data:"}</Strong>{" retained while your account is active, and for a limited period afterward in case you wish to reactivate it, unless you request earlier deletion."}</LI>
      <LI><Strong>{"Cùi Bắp messages:"}</Strong>{" text messages are retained on your device / synced storage per your settings; media (photos, files) is automatically deleted after 30 days unless you save it, with a notice sent 1 day before deletion."}</LI>
      <LI><Strong>{"Payment records:"}</Strong>{" retained as required by tax and accounting law (typically 5–10 years depending on jurisdiction), handled primarily by Paddle as the merchant of record."}</LI>
      <LI><Strong>{"Support communications:"}</Strong>{" retained for as long as needed to resolve your inquiry and for a reasonable period afterward for quality purposes."}</LI>
      </UL>
      <P>{"When data is no longer needed, we delete or anonymize it."}</P>
      <HR/>
      <H2>{"8. Cookies"}</H2>
      <P>{"We use a small number of cookies, grouped into three categories. You can manage your preferences at any time using the "}<Strong>{"Cookie Settings"}</Strong>{" link in the footer, or the banner shown on your first visit."}</P>
      <Table><thead><tr><Th>{"Category"}</Th><Th>{"Purpose"}</Th><Th>{"Can be disabled?"}</Th></tr></thead><tbody><tr><Td><Strong>{"Essential"}</Strong></Td><Td>{"Required for login sessions, security, and core site functionality (e.g., keeping you signed in)"}</Td><Td>{"No - the site cannot function without these"}</Td></tr><tr><Td><Strong>{"Analytics"}</Strong></Td><Td>{"Helps us understand aggregated, anonymized usage patterns so we can fix bugs and improve the Services"}</Td><Td>{"Yes"}</Td></tr><tr><Td><Strong>{"Preferences"}</Strong></Td><Td>{"Remembers settings like your chosen language or theme"}</Td><Td>{"Yes"}</Td></tr></tbody></Table>
      <P>{"We do "}<Strong>{"not"}</Strong>{" use marketing or advertising cookies, because Querencia does not run ads."}</P>
      <HR/>
      <H2>{"9. Your Rights"}</H2>
      <P>{"Depending on where you live, you may have some or all of the following rights over your personal data:"}</P>
      <UL>
      <LI><Strong>{"Access"}</Strong>{" - request a copy of the personal data we hold about you."}</LI>
      <LI><Strong>{"Rectification"}</Strong>{" - correct inaccurate or incomplete data."}</LI>
      <LI><Strong>{"Erasure (\"right to be forgotten\")"}</Strong>{" - request deletion of your data, subject to legal retention requirements."}</LI>
      <LI><Strong>{"Portability"}</Strong>{" - receive your data in a structured, machine-readable format."}</LI>
      <LI><Strong>{"Restriction"}</Strong>{" - ask us to limit how we process your data in certain circumstances."}</LI>
      <LI><Strong>{"Objection"}</Strong>{" - object to processing based on legitimate interest."}</LI>
      <LI><Strong>{"Withdraw consent"}</Strong>{" - where processing is based on consent (e.g., optional cookies), withdraw it at any time without affecting past processing."}</LI>
      <LI><Strong>{"Non-discrimination"}</Strong>{" (California residents) - we will not deny you the Services or charge you a different price for exercising your privacy rights."}</LI>
      <LI><Strong>{"Lodge a complaint"}</Strong>{" - with your local data protection authority (e.g., in the EU, the supervisory authority in your country of residence)."}</LI>
      </UL>
      <P>{"To exercise any of these rights, contact us at "}<Strong>{"[email protected]"}</Strong>{" or via the "}<A href="/message">{"Message Querencia"}</A>{" page. We will respond within the timeframe required by applicable law (typically 30 days under GDPR, 45 days under CCPA)."}</P>
      <H3>{"9.1 Vietnam Privacy Rights (Law on Personal Data Protection)"}</H3>
      <P>{"If Querencia is registered in Vietnam, we are subject to Vietnam's Law on Personal Data Protection (Law No. 91/2025/QH15, effective January 1, 2026) and its implementing decree, which replaced the earlier Decree 13/2023/ND-CP. This law applies to us regardless of where a user is physically located, whenever we process the personal data of a Vietnamese individual, and it is a "}<Strong>{"separate legal framework from GDPR"}</Strong>{" - compliance with GDPR does not automatically satisfy Vietnamese law."}</P>
      <P>{"Under this law, Vietnamese users additionally have the right to: know how their data is processed; give, decline, or withdraw consent; view, correct, or delete their data; request restriction of or object to processing; and file complaints, denunciations, or lawsuits, and request compensation for damages, through the competent Vietnamese authority (the Ministry of Public Security's Department of Data Protection and other relevant bodies)."}</P>
      <P>{"Where required, we will conduct and maintain personal data processing impact assessment records and submit them to the competent Vietnamese authority, appoint an internal data protection contact, and follow Vietnam's rules on cross-border data transfer."}</P>
      <Disclaimer>{"This section requires review by Vietnam-qualified legal counsel once the company's registration is finalized, since compliance obligations (impact assessment filing deadlines, breach notification timing, and specific consent formats) depend on the entity's registered status and should not be assumed from general research alone."}</Disclaimer>
      <H3>{"9.2 California Privacy Rights (CCPA/CPRA)"}</H3>
      <P>{"Querencia does not sell or share personal information as defined under the CCPA/CPRA, and we do not use sensitive personal information beyond what is necessary to provide the Services. California residents have the rights listed in Section 9 above, plus the right to know the categories of personal information collected and disclosed, which are described in Section 2 and Section 5 of this policy."}</P>
      <HR/>
      <H2>{"10. Children's Privacy"}</H2>
      <P>{"The Services are not directed at children under 13 (or the minimum age required by your country's law, e.g., 16 in some EU member states). We do not knowingly collect personal information from children below this age. If we learn that we have collected personal data from a child without appropriate consent, we will delete it promptly. If you believe a child has provided us with personal data, please contact us at "}<Strong>{"[email protected]"}</Strong>{"."}</P>
      <P>{"If Querencia is registered in Vietnam, note that Vietnamese law imposes additional, specific obligations for processing the personal data of children, including obtaining consent from a parent or legal guardian and, in some cases, verification of that consent. This section should be reviewed by Vietnam-qualified legal counsel to confirm the exact mechanism used before launch."}</P>
      <HR/>
      <H2>{"11. Data Security"}</H2>
      <P>{"We use industry-standard security measures to protect your data, including:"}</P>
      <UL>
      <LI>{"End-to-end encryption for Cùi Bắp messages (see Section 4)."}</LI>
      <LI>{"Encryption in transit (TLS) for all data sent to and from our servers."}</LI>
      <LI>{"Encryption at rest for stored data."}</LI>
      <LI>{"Access controls limiting employee access to personal data on a need-to-know basis."}</LI>
      <LI>{"Regular security review of our infrastructure providers."}</LI>
      </UL>
      <P>{"No system is 100% secure. If a data breach occurs that affects your personal data, we will notify affected users and relevant authorities as required by applicable law (e.g., within 72 hours under GDPR where feasible, and within the timeframe set by Vietnam's Law on Personal Data Protection where that law applies - this timeframe should be confirmed with Vietnam-qualified legal counsel, as it has changed between the earlier Decree 13/2023 and the current law effective 2026)."}</P>
      <P>{"See our full "}<A href="/pages/security">{"Security"}</A>{" page for more detail."}</P>
      <HR/>
      <H2>{"12. Changes to This Policy"}</H2>
      <P>{"We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through an in-app notice before the changes take effect. The \"Last updated\" date at the top of this page always reflects the most recent version."}</P>
      <HR/>
      <H2>{"13. Contact Us"}</H2>
      <P>{"If you have questions about this Privacy Policy or how we handle your data:"}</P>
      <UL>
      <LI><Strong>{"Email:"}</Strong>{" [email protected]"}</LI>
      <LI><Strong>{"In-app:"}</Strong>{" "}<A href="/message">{"Message Querencia"}</A></LI>
      </UL>
      <HR/>
      <Disclaimer>{"This Privacy Policy is a draft prepared for legal review. Before publishing, it should be reviewed by a qualified attorney - importantly, including Vietnam-qualified legal counsel to confirm compliance with Vietnam's Law on Personal Data Protection (effective January 1, 2026), since this is the home jurisdiction where Querencia will be registered and is a separate legal framework from GDPR, not automatically satisfied by GDPR compliance. It should also be reviewed for GDPR (EU/UK users) and CCPA/CPRA (California users) compliance, and all bracketed placeholders should be filled in with final, verified details."}</Disclaimer>
    </LegalPage>
  );
}
