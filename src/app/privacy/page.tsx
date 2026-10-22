import Container from "@/components/Container";
import { pageMetadata } from "@/lib/business";
export const metadata = pageMetadata("Enquiry Privacy | No Pressure Exterior Specialists", "How No Pressure uses enquiry details and optional website analytics. Contact hi@nopressure.au about your information.", "/privacy");
export default function PrivacyPage() {
  return <Container><article className="max-w-3xl space-y-6 py-12 leading-relaxed text-white/80">
    <h1 className="text-3xl font-bold text-white">Your enquiry and privacy</h1>
    <p>No Pressure Exterior Specialists uses the name, phone number, email, suburb and job details you provide to respond to your enquiry, prepare a quote and discuss a booking. Please only include information relevant to your cleaning job.</p>
    <h2 className="text-xl font-bold text-white">Sending your request</h2><p>Enquiries are sent to the business inbox through Resend, our email provider. The website is hosted by Vercel. These providers process information to operate the website and send email. Our form does not accept photo uploads. If you email photographs separately, avoid including people or unrelated personal details.</p>
    <p>A submitted request means the email service has accepted it for sending. It does not confirm inbox delivery. If you need to speak to us, call <a href="tel:0411076785" className="text-np-gold underline">0411 076 785</a>.</p>
    <h2 className="text-xl font-bold text-white">Optional analytics and advertising measurement</h2><p>When Google measurement is enabled, we ask before loading optional Google analytics and advertising cookies. Declining does not affect the quote form. With your permission we measure page views, quote button interactions, phone-link clicks and quote requests accepted for sending. A phone-link click does not mean a call took place.</p>
    <p>We do not send your name, email, phone number or job message as analytics event fields. With your permission, campaign parameters and advertising click identifiers can be retained for the browser session and included with your enquiry to help identify its source. You can change your choice through Cookie preferences in the footer when measurement is enabled.</p>
    <h2 className="text-xl font-bold text-white">Questions about your details</h2><p>To ask about access, correction or deletion of enquiry information, email <a href="mailto:hi@nopressure.au" className="text-np-gold underline">hi@nopressure.au</a>. Some records may need to be kept to meet business or legal obligations.</p>
  </article></Container>;
}
