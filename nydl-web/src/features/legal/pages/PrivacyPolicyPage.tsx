import { LegalDocument, LegalList, type LegalSection } from '../components/LegalDocument';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/components/common/SupportContactModal';

const UPDATED = 'July 18, 2026';

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who We Are',
    body: (
      <p>
        NYDEV Learning ("NYDL", "we", "us", or "our") is a cohort-based technology education platform operated by
        NYDev. This Privacy Policy explains what personal information we collect when you use our platform and
        websites, how we use and protect it, and the choices you have. By creating an account or registering for a
        course, you agree to the practices described here.
      </p>
    ),
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    body: (
      <>
        <p>We collect the following categories of information:</p>
        <LegalList
          items={[
            <><strong>Account details</strong> — your name, email address, password (stored only as a secure hash), and, if you sign in with GitHub, your GitHub profile basics.</>,
            <><strong>Registration information</strong> — during course registration we collect personal details (full name, gender, date of birth, phone), education (school, grade), location (city, region), technical readiness (operating system, whether you have a computer and Discord), your programming experience, and your reason for joining.</>,
            <><strong>Payment references</strong> — the payment method you choose and the transaction reference for your bank transfer. We do <strong>not</strong> collect or store your bank login, card numbers, or PINs.</>,
            <><strong>Learning activity</strong> — your enrollments, cohort and team membership, assignment submissions, attendance, progress, and certificates.</>,
            <><strong>Uploads</strong> — files you submit (assignment work, profile picture, resources) and any images you provide as registration proof.</>,
            <><strong>Technical data</strong> — basic device and log information needed to operate and secure the service.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'how-we-use',
    heading: 'How We Use Your Information',
    body: (
      <LegalList
        items={[
          'Create and manage your account and course enrollments.',
          'Verify your payment and grant access to your course, cohort, and team.',
          'Deliver live sessions, assignments, resources, announcements, and certificates.',
          'Track attendance and learning progress, and provide support.',
          'Communicate with you about your registration, sessions, and important updates.',
          'Keep the platform secure and prevent fraud or abuse.',
        ]}
      />
    ),
  },
  {
    id: 'payments-and-processors',
    heading: 'Payments & Service Providers',
    body: (
      <>
        <p>
          We rely on a small number of trusted providers to run the platform. They process data only as needed to
          provide their service:
        </p>
        <LegalList
          items={[
            <><strong>Verify.ET</strong> — verifies your bank transaction reference against the receiving bank to confirm your payment. We share the transaction reference and the receiving account details for this check.</>,
            <><strong>Cloudinary</strong> — securely stores files you upload (assignments, resources, session recordings, profile pictures).</>,
            <><strong>Brevo</strong> — delivers transactional emails such as registration confirmations and notifications.</>,
            <><strong>MongoDB Atlas</strong> — hosts our database.</>,
          ]}
        />
        <p>
          We do not sell your personal information, and we do not share it with advertisers.
        </p>
      </>
    ),
  },
  {
    id: 'minors',
    heading: 'Students Who Are Minors',
    body: (
      <p>
        Some of our courses are open to school students, including those under 18. If you are a minor, you must have
        your parent or legal guardian's permission to register, and they should review this policy with you. We only
        collect the information necessary to deliver the program. A parent or guardian may contact us at any time to
        review, correct, or request deletion of a minor's information using the details in the Contact section below.
      </p>
    ),
  },
  {
    id: 'data-sharing',
    heading: 'How Information Is Shared',
    body: (
      <LegalList
        items={[
          'With your instructors and mentors, limited to the courses and cohorts they are assigned to.',
          'With NYDL administrators, who manage registrations, payments, cohorts, and certificates.',
          'With your teammates, who can see your name and role within your project team.',
          'With the service providers listed above, strictly to operate the platform.',
          'Where required by law, or to protect the rights, safety, and security of our users and platform.',
        ]}
      />
    ),
  },
  {
    id: 'retention',
    heading: 'Data Retention',
    body: (
      <p>
        We keep your information for as long as your account is active and as needed to provide the service, issue
        certificates, and meet legal or accounting obligations. When information is no longer needed, we delete or
        anonymize it. You may request deletion of your account at any time; some records (for example, payment and
        certificate records) may be retained where we are required to keep them.
      </p>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    body: (
      <p>
        We protect your information using industry-standard measures: passwords are hashed, access to bank details is
        never collected, sessions use signed tokens, and access to administrative data is role-restricted. No online
        service can guarantee absolute security, but we work continuously to safeguard your data. If you believe your
        account has been compromised, contact us immediately.
      </p>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your Rights & Choices',
    body: (
      <LegalList
        items={[
          'Access and review the personal information in your profile.',
          'Correct inaccurate information through your profile settings or by contacting us.',
          'Request a copy or deletion of your personal information.',
          'Withdraw consent for optional processing (this may limit access to certain features).',
        ]}
      />
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies & Local Storage',
    body: (
      <p>
        We use cookies and browser local storage strictly to keep you signed in, remember your theme preference, and
        operate core features. We do not use third-party advertising or tracking cookies.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last
        updated" date above and, where appropriate, notify you through the platform. Continued use of NYDL after an
        update means you accept the revised policy.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    body: (
      <p>
        For any privacy questions or requests, reach us at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or {SUPPORT_PHONE}.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <p>
          Your privacy matters to us. This policy describes the personal information NYDEV Learning collects, why we
          collect it, and how we keep it safe. Please read it alongside our Terms of Service.
        </p>
      }
      sections={sections}
    />
  );
}
