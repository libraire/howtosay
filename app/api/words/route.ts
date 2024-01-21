import list from "../../data/dict.json";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {

  const wordlist = [];
  for (var i = 0; i < 10; i++) {
    var randomIndex = Math.floor(Math.random() * list.length);
    wordlist.push(list[randomIndex]);
  }

  return Response.json({ wordlist });
}
