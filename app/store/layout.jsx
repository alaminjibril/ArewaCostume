import StoreLayout from "@/components/store/StoreLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

//show this page when user is signed in

export const metadata = {
    title: "ArewaCostumes. - Store Dashboard",
    description: "ArewaCostumes. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <SignedIn>
                <StoreLayout>
                    {children}
                </StoreLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/store" routing="hash" />
                </div>
            </SignedOut>

        </>
    );
}
