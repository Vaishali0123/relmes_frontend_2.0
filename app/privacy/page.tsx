"use client";

import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-12">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              <strong className="font-semibold text-gray-700">
                Effective Date:
              </strong>{" "}
              21st November 2025
            </p>
          </div>

          <div className="text-gray-700 leading-relaxed space-y-5 text-sm sm:text-base">
            <p>
              Relmes ("we", "our", "us") is committed to protecting your privacy
              and ensuring transparency about how your personal information is
              collected, used, and safeguarded. This Privacy Policy explains how
              we handle data when you use the Relmes platform, including our
              website, applications, and services (collectively, the "Service").
            </p>

            <p>
              By using Relmes, you agree to the practices described in this
              Privacy Policy.
            </p>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                1. Information We Collect
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 mb-3">
                1.1 Information You Provide
              </h3>
              <p>
                We may collect the following personal information when you
                register or use Relmes:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Name</li>
                <li>Email address</li>
                <li>Username and profile details</li>
                <li>Password (hashed and encrypted)</li>
                <li>
                  Payment information (processed securely via third-party
                  providers)
                </li>
                <li>Files and content uploaded to your Realmes</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 mb-3">
                1.2 Automatically Collected Information
              </h3>
              <p>When you use Relmes, we automatically collect:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>IP address</li>
                <li>Device type and browser information</li>
                <li>Usage data (features accessed, session duration)</li>
                <li>Log files and system activity</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 mb-3">
                1.3 Realme & Module Data
              </h3>
              <p>
                Each Realme operates in an isolated data environment. We store:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Content created within Realmes</li>
                <li>Messages, tasks, files, and configurations</li>
                <li>Installed modules and their associated data</li>
              </ul>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                2. How We Use Your Information
              </h2>
              <p>We use collected data to:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Provide and maintain the Relmes platform</li>
                <li>Create and manage Realmes</li>
                <li>Enable collaboration features</li>
                <li>Process payments and subscriptions</li>
                <li>Improve performance and user experience</li>
                <li>Provide customer support</li>
                <li>Enforce terms and prevent misuse</li>
              </ul>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                3. Data Storage & Security
              </h2>
              <p>Relmes uses secure infrastructure including:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Encrypted communication (HTTPS/TLS)</li>
                <li>Isolated Realme databases</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure cloud storage for uploaded files</li>
              </ul>
              <p>
                Each Realme is logically isolated, and access is controlled by
                role-based permissions defined by its owner.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                4. Sharing of Information
              </h2>
              <p>
                We do not sell your personal data. We only share information
                with:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>
                  Trusted service providers (payment processors, cloud
                  providers)
                </li>
                <li>
                  Developers of installed modules (only Realme-relevant data)
                </li>
                <li>Law enforcement when legally required</li>
              </ul>
              <p>
                All third parties are obligated to comply with strict data
                protection standards.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                5. Cookies & Tracking
              </h2>
              <p>Relmes may use cookies and similar technologies to:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Maintain session information</li>
                <li>Analyze usage patterns</li>
                <li>Improve platform functionality</li>
              </ul>
              <p>
                You can control cookie preferences via your browser settings.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                6. Third-Party Integrations
              </h2>
              <p>
                Modules and plugins added by users may process data within their
                Realme. Relmes is not responsible for third-party module privacy
                practices; users are encouraged to review their policies.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                7. User Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 my-4 text-gray-700">
                <li>Access your personal data</li>
                <li>Update or correct information</li>
                <li>Request data deletion</li>
                <li>Export your data</li>
              </ul>
              <p>
                Requests can be made at:{" "}
                <a
                  href="mailto:support@relmes.com"
                  className="text-blue-600 hover:text-blue-700 underline transition-colors"
                >
                  support@relmes.com
                </a>
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                8. Data Retention
              </h2>
              <p>
                We retain user data as long as your account is active or as
                required for legal and operational purposes. You may request
                deletion at any time.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                9. Children's Privacy
              </h2>
              <p>
                Relmes is not intended for children under 13. We do not
                knowingly collect information from minors.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. We will notify
                users of significant changes through the platform or via email.
              </p>
            </section>

            <hr className="my-6 border-gray-200" />

            {/* <section className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">
                11. Contact Us
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or data
                handling practices, contact us at:
              </p>
              <ul className="list-none pl-0 space-y-2 my-4">
                <li>
                  📧{" "}
                  <a
                    href="mailto:support@relmes.com"
                    className="text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    support@relmes.com
                  </a>
                </li>
                <li>
                  🌐{" "}
                  <a
                    href="https://relmes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    https://relmes.in
                  </a>
                </li>
              </ul>
            </section> */}

            <hr className="my-6 border-gray-200" />

            <section className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 sm:p-6 rounded-lg my-6 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Summary
              </h2>
              <p>
                Relmes respects your privacy and ensures that your data remains
                secure, isolated, and under your control. Your Relm belong to
                you, and we take every step to protect that ownership.
              </p>
            </section>

            {/* <hr className="my-6 border-gray-200" />

            <p className="text-xs sm:text-sm text-gray-500 italic bg-gray-50 p-4 rounded border-l-4 border-gray-300">
              This Privacy Policy template is for informational purposes and
              should be reviewed by a legal professional to ensure compliance
              with applicable laws such as GDPR, CCPA, and other regional data
              protection regulations.
            </p> */}
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Relmes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
