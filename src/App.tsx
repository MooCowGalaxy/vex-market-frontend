import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavbarLayout from '@/layouts/NavbarLayout.tsx';
import Home from '@/pages/Home.tsx';
import MyListings from '@/pages/MyListings.tsx';
import List from '@/pages/List.tsx';
import AuthLayout from '@/layouts/AuthLayout.tsx';
import Login from '@/pages/auth/Login.tsx';
import Register from '@/pages/auth/Register.tsx';
import VerifyEmail from '@/pages/auth/VerifyEmail.tsx';
import Search from '@/pages/Search.tsx';
import ListingDetails from '@/pages/listing/ListingDetails.tsx';
import Messages from '@/pages/Messages.tsx';
import Chat from '@/pages/messages/Chat.tsx';
import Settings from '@/pages/Settings.tsx';
import NotFound from '@/pages/404.tsx';

function App() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Routes>
                <Route path="/" element={<NavbarLayout />}>
                    <Route index element={<Home />} />
                    <Route path="listings" element={<MyListings />} />
                    <Route path="list" element={<List />} />
                    <Route path="search" element={<Search />} />
                    <Route path="listing/:id" element={<ListingDetails />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:chatId" element={<Chat />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="verify/:token" element={<VerifyEmail />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
