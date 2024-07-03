

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {

    const body = await request.json();
    const response = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/api/v1/feedback", {
        method: 'POST',
        body: JSON.stringify({ app: 'howtosay', body: body.body }),
    })
    return Response.json({});
}