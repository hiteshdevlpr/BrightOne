'use client';

import React from 'react';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import Link from 'next/link';

export default function PrivacyPageClient() {
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
                                                    Privacy Policy
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
                                                <h2 className="h4 text-white mb-3">1. Introduction</h2>
                                                <p className="mb-0">BrightOne Creative (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our website (brightone.ca), book our services, or otherwise interact with us. We comply with applicable Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and provincial legislation where applicable. By using our website or services, you consent to the practices described in this policy.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">2. Information We Collect</h2>
                                                <p>We may collect the following types of information:</p>
                                                <p><strong>Information you provide:</strong></p>
                                                <ul>
                                                    <li>Name, email address, phone number, and mailing address when you contact us, request a quote, or book a service.</li>
                                                    <li>Property address and details relevant to the service (e.g., access instructions, listing information).</li>
                                                    <li>Payment and billing information as needed to process payments (we use secure third-party payment processors where applicable).</li>
                                                    <li>Communications you send us and our responses.</li>
                                                </ul>
                                                <p><strong>Information collected automatically:</strong></p>
                                                <ul>
                                                    <li>Technical data such as IP address, browser type, device type, and operating system.</li>
                                                    <li>Usage data such as pages visited, time spent on the site, and referring website.</li>
                                                    <li>Cookies and similar technologies as described in the Cookies section below.</li>
                                                </ul>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">3. How We Use Your Information</h2>
                                                <p>We use your information to:</p>
                                                <ul>
                                                    <li>Provide, manage, and improve our photography, videography, and related services.</li>
                                                    <li>Process bookings, send confirmations, and deliver your projects.</li>
                                                    <li>Process payments and manage billing.</li>
                                                    <li>Communicate with you about your projects and respond to enquiries.</li>
                                                    <li>Send marketing or promotional communications (only where you have opted in or where permitted by law; you may opt out at any time).</li>
                                                    <li>Improve our website, services, and user experience.</li>
                                                    <li>Comply with legal obligations and protect our rights and the rights of others.</li>
                                                    <li>Prevent fraud and ensure the security of our systems.</li>
                                                </ul>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">4. Sharing Your Information</h2>
                                                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                                                <ul>
                                                    <li><strong>Service providers:</strong> With trusted third parties who assist us (e.g., payment processors, email delivery, cloud storage), subject to confidentiality and data protection obligations.</li>
                                                    <li><strong>Legal requirements:</strong> When required by law, court order, or government request, or to protect our rights, safety, or property.</li>
                                                    <li><strong>With your consent:</strong> Where you have given us explicit permission.</li>
                                                </ul>
                                                <p className="mb-0">We require third parties to use your information only for the purposes we specify and in accordance with applicable privacy laws.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">5. Cookies & Similar Technologies</h2>
                                                <p>Our website may use cookies and similar technologies to remember preferences, analyse traffic, and improve functionality. You can set your browser to refuse or limit cookies; some features of the site may not work as intended if you do. We may use analytics services (e.g., Google Analytics) that use cookies to collect aggregated, non-personally identifying usage data.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">6. Data Retention & Security</h2>
                                                <p>We retain your personal information only as long as necessary to fulfil the purposes described in this policy, to comply with legal obligations, or to resolve disputes. We implement reasonable technical and organisational measures to protect your information against unauthorised access, loss, or alteration. No method of transmission or storage is 100% secure; we cannot guarantee absolute security.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">7. Your Rights & Choices</h2>
                                                <p>Depending on applicable law, you may have the right to:</p>
                                                <ul>
                                                    <li>Access the personal information we hold about you.</li>
                                                    <li>Request correction of inaccurate or incomplete information.</li>
                                                    <li>Request deletion of your personal information (subject to legal and contractual limits).</li>
                                                    <li>Withdraw consent where we rely on consent for processing.</li>
                                                    <li>Opt out of marketing communications at any time (e.g., via unsubscribe links or by contacting us).</li>
                                                    <li>Lodge a complaint with a supervisory authority if you believe we have not handled your information properly.</li>
                                                </ul>
                                                <p className="mb-0">To exercise these rights or ask questions about your data, contact us at <a href="mailto:contact@brightone.ca" className="text-white">contact@brightone.ca</a>. We will respond in accordance with applicable law.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">8. Third-Party Links</h2>
                                                <p className="mb-0">Our website may contain links to third-party sites (e.g., social media). We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies before providing any personal information.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">9. Children</h2>
                                                <p className="mb-0">Our services and website are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us and we will take steps to delete it.</p>
                                            </section>

                                            <section className="mb-5">
                                                <h2 className="h4 text-white mb-3">10. Changes to This Policy</h2>
                                                <p className="mb-0">We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will be revised when changes are made. We encourage you to review this page periodically. Continued use of our website or services after changes constitutes acceptance of the updated policy. For material changes, we may provide additional notice (e.g., by email or a notice on our website).</p>
                                            </section>

                                            <section className="mb-0">
                                                <h2 className="h4 text-white mb-3">11. Contact Us</h2>
                                                <p className="mb-0">For privacy-related questions, to exercise your rights, or to request a copy of this policy, contact BrightOne Creative at <a href="mailto:contact@brightone.ca" className="text-white">contact@brightone.ca</a> or (416) 419-9689. You can also review our <Link href="/terms" className="text-white">Terms and Conditions</Link> for the terms governing use of our website and services.</p>
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
