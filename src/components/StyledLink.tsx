import React from 'react';
import { Link } from 'react-router-dom';

export default function StyledLink({ children, to, className = '' }: { children: React.ReactNode, to: string, className?: string }) {
    return (
        <Link className={`block w-max text-muted-foreground hover:underline hover:text-foreground transition-colors ${className}`} to={to}>
            {children}
        </Link>
    );
}