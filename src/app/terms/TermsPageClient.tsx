'use client';

import React from 'react';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import Link from 'next/link';

export default function TermsPageClient() {
    useScrollSmooth();

    return (
        <Wrapper>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div className="inner-bg" style={{ backgroundImage: "url(/assets/img/home-01/team/team-details-bg.png)" }}>
                        <main>
                            <div className="tm-hero-area tm-hero-ptb p-relative">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="tm-hero-content">
                                                <span className="tm-hero-subtitle">Legal</span>
                                                <h4 className="tm-hero-title-big" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
                                                    Terms & Conditions
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container py-5 pb-80">
                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                        <div className="legal-content text-white-50">
                                            <p className="mb-4"><strong>Last updated:</strong> February 2025</p>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">1. Introduction & Definitions</h2>
                                                <p>BrightOne Creative (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides professional real estate photography, videography, virtual tours, and related creative services in the Greater Toronto Area and surrounding regions. By booking our services or using our website, you (&quot;you&quot;, &quot;client&quot;) agree to these Terms and Conditions.</p>
                                                <ul className="mb-0">
                                                    <li><strong>Location</strong> means the property or address where services are performed.</li>
                                                    <li><strong>Media</strong> means any photographs, video recordings, virtual tours, and edited digital files we produce.</li>
                                                    <li><strong>Final deliverable(s)</strong> means the edited media we provide to you upon completion of the project.</li>
                                                    <li><strong>Project confirmation</strong> means our written confirmation (email or PDF) of your booking, including scope, price, and reference.</li>
                                                </ul>
                                                <p className="mt-3 mb-0">By placing a booking you confirm that you have read these terms, agree to be bound by them, and consent to our use of your information as set out in our <Link href="/privacy" className="text-white">Privacy Policy</Link>.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">2. Booking & Contract</h2>
                                                <p className="mb-0">A contract is formed when we send you a project confirmation in response to your online booking, enquiry, or acceptance of a quote. The confirmation will set out the services, price, and any special terms for that project.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">3. Payment & Deposits</h2>
                                                <p>You agree to pay our invoices in full by the due date(s) stated. Unless otherwise agreed in writing:</p>
                                                <ul>
                                                    <li>Payments are due in Canadian dollars (CAD).</li>
                                                    <li>We may require a deposit to secure your booking; the balance is due as set out in the project confirmation.</li>
                                                    <li>Deliverables may be withheld until full payment is received.</li>
                                                    <li>Late payments may be subject to interest at a reasonable rate. Any bank or transfer fees are your responsibility so that we receive the full invoiced amount.</li>
                                                </ul>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">4. Cancellation & Rescheduling</h2>
                                                <p>Once a date is confirmed, we require reasonable notice (typically at least 48–72 hours) to cancel or reschedule without penalty, unless otherwise stated in your project confirmation. Weather-related rescheduling may be offered when conditions would materially affect the quality of photography or videography (e.g., heavy rain or snow). We will work with you to reschedule where possible but cannot guarantee availability.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">5. Rights & Usage</h2>
                                                <p>Unless you tell us in writing within 14 days of receiving the final deliverable that you do not consent, you grant us permission to use the media (e.g., video, photos) from the project for our own promotional and demonstration purposes, including our website, social media, and marketing materials. We will not use confidential or sensitive client information in a way that identifies you or the property without your consent.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">6. Ownership & Deliverables</h2>
                                                <p>Upon full payment, you receive a licence to use the final deliverable(s) for the purposes agreed (typically marketing and listing the property). Unless otherwise agreed in your project confirmation, raw footage, unedited files, and outtakes remain our property. We are not responsible for long-term storage of media beyond the delivery period stated in your project confirmation.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">7. Your Responsibilities</h2>
                                                <p>You are responsible for ensuring the location is reasonably prepared and accessible for the shoot (e.g., staging, access, no tenants if required). Any restrictions on areas we may film or photograph may limit the result. You must have the right to authorise photography/videography at the location and to provide any branding materials (logos, contact details) that do not infringe third-party rights.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">8. Revisions & Corrections</h2>
                                                <p>We will use reasonable efforts to deliver work that matches our agreed style and your brief. If the project includes a set number of revisions, those will be specified in the project confirmation. Requests for revisions or corrections beyond that, or after delivery, are at our discretion unless the error is due to our mistake (e.g., wrong branding, spelling errors we introduced). Please raise any issues promptly after receiving the deliverable.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">9. Liability</h2>
                                                <p>Our total liability to you for any claim arising from or related to our services will not exceed the total amount you paid for the project in question. We are not liable for indirect or consequential loss (e.g., lost profits, lost listings). We are not liable for loss of footage or materials after the shoot due to circumstances beyond our control, or for your failure to back up delivered files. You agree to indemnify us against claims arising from your breach of these terms or from materials you provide (e.g., unauthorised use of third-party branding).</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">10. Force Majeure</h2>
                                                <p>We are not in breach of these terms nor liable for delay or failure to perform if the cause is beyond our reasonable control (e.g., illness, severe weather, equipment failure, safety issues). In such cases we will endeavour to reschedule or find a solution but cannot guarantee a specific outcome.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">11. Termination</h2>
                                                <p>If you materially breach these terms, we may terminate the agreement. Fees for work already performed or committed will remain due. If we materially breach these terms, you may terminate and may be entitled to a refund for unperformed services as appropriate.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">12. General</h2>
                                                <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada. Any dispute will be subject to the courts of Ontario. If any part of these terms is found to be invalid, the rest remains in effect. You may not assign your rights under this agreement without our written consent.</p>
                                            </section>

                                            <section className="mb-0">
                                                <h2 className="h4 text-white mb-3">13. Contact</h2>
                                                <p className="mb-0">For questions about these Terms and Conditions, contact us at <a href="mailto:contact@brightone.ca" className="text-white">contact@brightone.ca</a> or (416) 419-9689.</p>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <FooterFour />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .legal-content ul { padding-left: 1.25rem; margin-bottom: 1rem; }
                .legal-content li { margin-bottom: 0.25rem; }
                .legal-content a:hover { text-decoration: underline; }
            `}</style>
        </Wrapper>
    );
}
