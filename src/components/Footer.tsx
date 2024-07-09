import { Mail } from 'lucide-react';
import StyledLink from '@/components/StyledLink.tsx';

export default function Footer() {
    return (
        <div className="bg-muted flex-initial">
            <div className="mx-auto w-full md:w-192 px-6 py-12">
                <h1 className="text-2xl font-bold mb-6">VEX Market</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
                    <div>
                        <h1 className="block w-max text-xl font-semibold mb-2">Quick Links</h1>
                        <StyledLink to="/">Browse Listings</StyledLink>
                        <StyledLink className="mb-4" to="/post">Create Listing</StyledLink>
                    </div>
                    <div>

                        <h1 className="text-xl font-semibold mb-2">Legal</h1>
                        <StyledLink to="/legal/terms">Terms of Service</StyledLink>
                        <StyledLink to="/legal/privacy">Privacy Policy</StyledLink>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Contact</h1>
                        <div className="mb-4">
                            <a href="mailto:contact@vexmarket.com" className="align-middle">
                                <Mail className="inline mr-2"/>
                                <span>contact@vexmarket.com</span>
                            </a>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">&copy; VEX Market 2024</p>
            </div>
        </div>
    );
}