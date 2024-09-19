import Markdown from 'react-markdown';
import useTitle from '@/hooks/useTitle.ts';

const markdownText = `# Terms of Service

Last Updated: September 16th, 2024

## 1. Acceptance of Terms

By accessing or using VEXMarket.com (the "Website"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Website.

## 2. User Accounts

2.1. To access certain features of the Website, you may be required to create an account.

2.2. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.

2.3. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.

## 3. User Conduct

3.1. You agree to use the Website only for its intended purpose of connecting buyers and sellers.

3.2. You agree not to:
   - a) Post any illegal content or engage in any illegal activities through the Website.
   - b) Exploit the Website or attempt to access any unauthorized content.
   - c) Use the Website in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from utilizing the Website.
   - d) Attempt to gain unauthorized access to any part of the Website or any other systems or networks connected to the Website.

3.3. If you encounter any illegal content or activities on the Website, please report it to abuse@vexmarket.com.

## 4. User-Generated Content and Intellectual Property

4.1. Users retain ownership rights to any content they post on the Website, including text and images.

4.2. By posting content on the Website, you grant VEXMarket.com a non-exclusive, royalty-free, worldwide license to use, display, and distribute the content solely for the purpose of operating and improving the Website.

## 5. Privacy and Data Handling

5.1. We only store data that is strictly necessary for the Website's functionality.

5.2. For more information on how we collect, use, and protect your data, please refer to our Privacy Policy.

## 6. Fees and Payments

6.1. The use of VEXMarket.com is entirely free. There are no listing fees or other charges for using the Website's core functionality.

6.2. While there may be a donation button in the footer of the Website, any donations are voluntary and handled through a third-party platform (Kofi). VEXMarket.com is not responsible for any transactions made through this third-party platform.

## 7. Dispute Resolution

7.1. VEXMarket.com does not participate in dispute resolution between users.

7.2. If a dispute causes disruption to other users or violates these Terms, the offending user(s) may be banned from accessing the Website at our sole discretion.

## 8. Limitation of Liability

8.1. VEXMarket.com is not responsible for any loss that may have been caused by the use of the Website. Users are solely responsible for protecting themselves from potential scams or fraudulent activities.

8.2. We do not guarantee the accuracy, completeness, or usefulness of any information on the Website or any results that may be obtained from the use of the Website.

## 9. Disclaimers

The Website is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We do not warrant that the Website will be uninterrupted, timely, secure, or error-free. We do not endorse, warrant, or assume responsibility for any product or service advertised or offered by a third party through the Website.

## 10. Termination

We reserve the right to terminate or suspend your account and access to the Website at our sole discretion, without notice, for any reason, including a breach of these Terms. If you wish to terminate your account, please contact us at support@vexmarket.com.

## 11. Changes to Terms

We reserve the right to modify these Terms at any time. We will notify users of any significant changes through an email notification. Your continued use of the Website after such modifications constitutes your acceptance of the updated Terms.

## 12. Contact Information

If you have any questions or concerns about these Terms, please contact us at legal@vexmarket.com.

By using VEXMarket.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

export default function Terms() {
    useTitle('Terms of Service - VEX Market');

    return (
        <Markdown className="markdown-content">
            {markdownText}
        </Markdown>
    );
}