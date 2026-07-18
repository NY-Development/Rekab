import { LegalDocument, LegalList, type LegalSection } from '../components/LegalDocument';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/components/common/SupportContactModal';

const UPDATED = 'July 18, 2026';

const sections: LegalSection[] = [
  {
    id: 'acceptance',
    heading: 'Acceptance of These Terms',
    body: (
      <p>
        These Terms of Service ("Terms") govern your access to and use of the NYDEV Learning ("NYDL") platform,
        websites, and services. By creating an account, registering for a course, or otherwise using NYDL, you agree
        to these Terms. If you do not agree, please do not use the platform. If you are under 18, you may only use
        NYDL with the consent and supervision of a parent or legal guardian.
      </p>
    ),
  },
  {
    id: 'accounts',
    heading: 'Your Account',
    body: (
      <LegalList
        items={[
          'You must provide accurate, current, and complete information when registering.',
          'You are responsible for keeping your password confidential and for all activity under your account.',
          'One account per person. Do not share your account or impersonate others.',
          'Notify us promptly of any unauthorized use of your account.',
        ]}
      />
    ),
  },
  {
    id: 'enrollment-and-cohorts',
    heading: 'Enrollment, Cohorts & Teams',
    body: (
      <>
        <p>
          Courses run on a cohort basis. A <strong>cohort</strong> is the group of all students taking a course within
          a batch (for example, the current Summer 2026 batch). Within a cohort, instructors may organize students
          into smaller <strong>teams</strong> for group projects. Placement into cohorts and teams is managed by NYDL
          and your instructors.
        </p>
        <p>
          Access to a course is granted once your payment for that course is verified. You agree to participate in
          good faith, attend sessions, and complete assignments as required by your program.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    heading: 'Fees & Payments',
    body: (
      <>
        <LegalList
          items={[
            'Course fees are shown at registration in Ethiopian Birr (ETB) unless stated otherwise.',
            'Payment is made by transferring the course fee to the account shown during registration and submitting your transaction reference.',
            'We verify your transaction reference through our payment verification provider. Access is granted only after verification succeeds and the amount paid meets the course fee.',
            'You are responsible for entering a correct, genuine transaction reference. Submitting a false, reused, or fraudulent reference may result in suspension.',
          ]}
        />
        <p>
          Refunds, where offered, are handled on a case-by-case basis according to our then-current policy. Contact us
          for any billing questions.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable Use',
    body: (
      <>
        <p>You agree not to:</p>
        <LegalList
          items={[
            'Share, resell, or redistribute course content, recordings, or resources without permission.',
            'Submit work that is not your own, or otherwise engage in academic dishonesty.',
            'Harass, threaten, or discriminate against instructors, staff, or fellow students.',
            'Attempt to disrupt, reverse-engineer, or gain unauthorized access to the platform.',
            'Upload malicious code or unlawful, infringing, or harmful content.',
          ]}
        />
        <p>Violations may lead to warnings, suspension, or removal from the program without refund.</p>
      </>
    ),
  },
  {
    id: 'content-and-ip',
    heading: 'Content & Intellectual Property',
    body: (
      <>
        <p>
          All course materials, curricula, videos, and platform software are the property of NYDEV Learning or its
          licensors and are protected by intellectual property laws. You are granted a limited, personal,
          non-transferable license to access and use them for your own learning while enrolled.
        </p>
        <p>
          You retain ownership of the work and files you submit. By submitting work, you grant NYDL a limited license
          to store, display, and review it for the purpose of delivering, grading, and improving the program.
        </p>
      </>
    ),
  },
  {
    id: 'certificates',
    heading: 'Certificates',
    body: (
      <p>
        Certificates are awarded at NYDL's discretion to students who satisfy the requirements of their program,
        including attendance, assignment completion, and any assessments. A certificate confirms participation and
        completion; it is not a guarantee of employment, internship placement, or any specific outcome.
      </p>
    ),
  },
  {
    id: 'internship',
    heading: 'Internship & Career Opportunities',
    body: (
      <p>
        Some programs reference internship pipelines or career opportunities. Any such opportunities are
        performance-based and are not guaranteed. Eligibility depends on your performance, conduct, and availability,
        as well as opportunities available at the time.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers & Limitation of Liability',
    body: (
      <p>
        NYDL is provided on an "as is" and "as available" basis. While we work hard to deliver a reliable service, we
        do not guarantee that it will be uninterrupted or error-free. To the fullest extent permitted by law, NYDEV
        Learning is not liable for indirect, incidental, or consequential damages arising from your use of the
        platform. Nothing in these Terms limits liability that cannot be limited under applicable law.
      </p>
    ),
  },
  {
    id: 'suspension',
    heading: 'Suspension & Termination',
    body: (
      <p>
        We may suspend or terminate access to your account if you breach these Terms, engage in fraudulent payment
        activity, or misuse the platform. You may stop using NYDL at any time and request account deletion, subject to
        records we are required to retain.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to These Terms',
    body: (
      <p>
        We may update these Terms from time to time. When we make material changes, we will update the "Last updated"
        date above and, where appropriate, notify you through the platform. Continued use of NYDL after an update
        means you accept the revised Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    body: (
      <p>
        Questions about these Terms? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or{' '}
        {SUPPORT_PHONE}.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      title="Terms of Service"
      updated={UPDATED}
      intro={
        <p>
          Welcome to NYDEV Learning. These Terms set out the rules for using our platform and enrolling in our
          programs. Please read them carefully — they form a binding agreement between you and NYDL.
        </p>
      }
      sections={sections}
    />
  );
}
