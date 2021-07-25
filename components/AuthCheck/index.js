import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { UserContext } from "../../lib/context";
import { auth } from "../../lib/firebase"

export default function AuthCheck(props) {
    const { user, loading } = useContext(UserContext);
    const router = useRouter(); // Router Initialization to prepare for imperative navigation if not logged in
        
    useEffect(() => {
        if (!user & !loading) {
          router.push('/enter')
        }
      }, [user])

    return user ? props.children : props.fallback || <Link href="/enter"><a>You must be signed in.</a></Link>
}