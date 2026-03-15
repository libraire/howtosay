import scene from "../../../data/scene.json";
import kitchen from "../../../data/imageset/kitchen.json";
import fruits from "../../../data/imageset/fruits.json";
import animals from "../../../data/imageset/animals.json";
import food from "../../../data/imageset/food.json";
import emoji_activity from "../../../data/emoji/activity.json";
import emoji_animal from "../../../data/emoji/animal-nature.json";
import emoji_food from "../../../data/emoji/food-drink.json";
import emoji_object from "../../../data/emoji/objects.json";
import emoji_travel from "../../../data/emoji/travel-place.json";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const level = params.get("level");

  let slug = "";
  switch (level) {
    case "0": slug = "kindergarten"; break;
    case "1": slug = "grade1"; break;
    case "2": slug = "grade2"; break;
    case "3": slug = "grade3"; break;
    case "4": slug = "grade4"; break;
    case "5": slug = "grade5"; break;
    case "6": slug = "grade6"; break;
    case "7": slug = "grade7"; break;
    case "8": slug = "grade8"; break;
    case "9": slug = "grade9"; break;
    case "10": slug = "grade10"; break;
    case "11": slug = "grade11"; break;
    case "12": slug = "grade12"; break;
    case "13": slug = "SAT"; break;
    case "14": slug = "TOEFL"; break;
    case "15": slug = "IELT"; break;
    case "16": return sceneList();
    case "17": return imageList(kitchen);
    case "18": return imageList(fruits);
    case "19": return imageList(animals);
    case "20": return imageList(food);
    case "21": slug = "oxford3000"; break;
    case "emoji-1": return emojiList(emoji_activity);
    case "emoji-2": return emojiList(emoji_animal);
    case "emoji-3": return emojiList(emoji_food);
    case "emoji-4": return emojiList(emoji_object);
    case "emoji-5": return emojiList(emoji_travel);
    default: return Response.json({ status: "failed", message: "Invalid level" }, { status: 400 });
  }

  if (slug) {
    return fetchByCategory(slug, request);
  }

  return Response.json({ status: "failed" }, { status: 400 });
}

async function fetchByCategory(slug: string, request: Request) {
  const cookie = request.headers.get("cookie");
  const headers: HeadersInit = cookie ? { 'cookie': cookie } : {};
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/hts/api/v1/dict/category/${slug}?count=10`, 
    { method: 'GET', headers }
  );

  if (response.ok) {
    const data = await response.json();
    return Response.json({ wordlist: data.wordlist });
  }

  return Response.json({ status: "failed" }, { status: response.status });
}

function sceneList() {
  const wordlist = [];
  for (var i = 0; i < scene.length; i++) {
    var vec = scene[i];
    wordlist.push({
      word: vec[0],
      definition: vec[1],
      imgurl: vec.length > 2 ? vec[2] : "",
    });
  }

  return Response.json({ wordlist });
}

function imageList(list: string[][]) {
  const wordlist = [];
  const host = "https://158f2f6d.telegraph-image-bya.pages.dev";
  for (var i = 0; i < list.length; i++) {
    var vec = list[i];
    wordlist.push({
      word: vec[0],
      definition: vec[1],
      imgurl: vec.length > 2 ? host + vec[2] : "",
    });
  }

  return Response.json({ wordlist });
}

function emojiList(list: string[][]) {
  const wordlist = [];
  for (var i = 0; i < list.length; i++) {
    var vec = list[i];
    wordlist.push({
      word: vec[0],
      emoji: vec[1],
    });
  }

  return Response.json({ wordlist });
}

