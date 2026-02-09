import { getServerSession } from "next-auth/next"

export async function GET() {
    const session = await getServerSession()

    return Response.json({ session });
}