import list from "../../data/dict.json";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const numberOfItemsToPick = 10;
  const wordlist = [];
  while (wordlist.length < numberOfItemsToPick && list.length > 0) {
    const randomIndex = Math.floor(Math.random() * list.length);
    const pickedItem = list.splice(randomIndex, 1)[0];
    wordlist.push(pickedItem);
  }

  return Response.json({ wordlist });
}
