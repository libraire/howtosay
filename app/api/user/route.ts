import { auth } from "auth"
import { useSession, signIn, signOut } from "next-auth/react"

import { getServerSession } from "next-auth/next"



export async function GET(req: Request, res: Response) {

    const session = await getServerSession()


    

    // const { data: session, status } = useSession()

    // session.user = {
    //     name: session.user.name,
    //     email: session.user.email,
    //     image: session.user.image,
    // }

    return Response.json({ session });
}