import Markdown from 'react-markdown';

const markdownText = `# Privacy Policy

Last Updated: September 16th, 2024

## 1. Information We Collect

We collect and store only the information that is strictly necessary for the functionality of VEXMarket.com. This may include, but is not limited to:

- Account information (e.g., username, email address)
- Listing details provided by sellers
- Messages exchanged between users
- IP addresses and basic usage data for security and functionality purposes

## 2. How We Use Your Information
We use the collected information solely for the purpose of providing and improving our services. This includes:

- Facilitating communication between buyers and sellers
- Maintaining and improving the website's functionality
- Ensuring the security of our users and the website
- Complying with legal obligations

## 3. Data Retention
We retain your data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
## 4. Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
## 5. Third-Party Services
Our website may contain links to third-party websites or services, such as the donation button linked to Kofi. We are not responsible for the privacy practices or content of these third-party sites.
## 7. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
## 8. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at legal@vexmarket.com.
By using VEXMarket.com, you agree to the collection and use of information in accordance with this Privacy Policy.`;

export default function Privacy() {
    return (
        <Markdown className="markdown-content">
            {markdownText}
        </Markdown>
    );
}