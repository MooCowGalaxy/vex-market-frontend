import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { CircleUser, Mail, Menu, Package2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { useUser } from '@/providers/UserProvider.tsx';
import Footer from '@/components/Footer.tsx';
import React, { useEffect, useState } from 'react';

export default function NavbarLayout() {
    const user = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

    useEffect(() => {
        setSearchInput(searchQuery || '');
    }, [searchQuery]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
    };

    const submitSearch = () => {
        navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    };

    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <header
                className="z-50 flex-initial sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav
                    className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">VEX Market</span>
                    </Link>
                    <Link
                        to="/"
                        className={location.pathname === '/' ? `text-foreground` : `text-muted-foreground transition-colors hover:text-foreground`}
                    >
                        Browse
                    </Link>
                    <Link
                        to="/listings"
                        className={location.pathname === '/listings' ? `w-max text-foreground` : `w-max text-muted-foreground transition-colors hover:text-foreground`}
                    >
                        My Listings
                    </Link>
                    <Link
                        to="/post"
                        className={location.pathname === '/post' ? `w-max text-foreground` : `w-max text-muted-foreground transition-colors hover:text-foreground`}
                    >
                        Create Listing
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6"/>
                                <span className="sr-only">Vex Marketplace</span>
                            </Link>
                            <Link
                                to="/"
                                className={`${location.pathname !== '/' ? 'text-muted-foreground' : ''} hover:text-foreground`}
                            >
                                Browse
                            </Link>
                            <Link
                                to="/listings"
                                className={`${location.pathname !== '/listings' ? 'text-muted-foreground' : ''} hover:text-foreground`}
                            >
                                My Listings
                            </Link>
                            <Link
                                to="/post"
                                className={`${location.pathname !== '/post' ? 'text-muted-foreground' : ''} hover:text-foreground`}
                            >
                                Create Listing
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search for listings"
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                maxLength={200}
                                value={searchInput}
                                onChange={onSearchChange}
                                onKeyDown={onSearchKey}
                            />
                        </div>
                    </div>
                    {user.loggedIn && (
                        <Link to="/messages" className="-mr-2 md:mr-0 lg:-mr-2">
                            <div className="relative">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Mail className="h-5 w-5"/>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                                {user.notifications !== null && user.notifications > 0 && <div
                                    className="absolute top-0 right-0 rounded-full w-4 h-4 flex flex-col items-center justify-center bg-primary">
                                    <div className="mx-auto text-center text-white text-xs font-reading">{user.notifications}</div>
                                </div>}
                            </div>
                        </Link>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5"/>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {user.loggedIn ?
                                <>
                                    <DropdownMenuLabel>Hi, {user.firstName}!</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <Link to="/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
                                    <DropdownMenuSeparator/>
                                    <Link to="/auth/logout"><DropdownMenuItem>Log out</DropdownMenuItem></Link>
                                </> :
                                <>
                                    <Link to="/auth/login"><DropdownMenuItem>Log in</DropdownMenuItem></Link>
                                    <Link to="/auth/register"><DropdownMenuItem>Register</DropdownMenuItem></Link>
                                </>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <Outlet />
            <Footer />
        </div>
    );
}