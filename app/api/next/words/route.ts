import list from "../../../data/dict.json";
import grade1 from "../../../data/index/grade1Index.json";
import grade2 from "../../../data/index/grade2Index.json";
import grade3 from "../../../data/index/grade3Index.json";
import grade4 from "../../../data/index/grade4Index.json";
import grade5 from "../../../data/index/grade5Index.json";
import grade6 from "../../../data/index/grade6Index.json";
import grade7 from "../../../data/index/grade7Index.json";
import grade8 from "../../../data/index/grade8Index.json";
import grade9 from "../../../data/index/grade9Index.json";
import grade10 from "../../../data/index/grade10Index.json";
import grade11 from "../../../data/index/grade11Index.json";
import grade12 from "../../../data/index/grade12Index.json";
import kindergarten from "../../../data/index/kindergartenIndex.json";
import ielt from "../../../data/index/IELTIndex.json";
import toefl from "../../../data/index/TOEFLIndex.json";
import sat from "../../../data/index/SATIndex.json";
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
import oxford3000 from "../../../data/index/oxford3000.json";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {

  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const level = params.get("level");
  var indexer = ielt;

  switch (level) {
    case "0":
      return indexerList(kindergarten, request);
    case "1":
      return indexerList(grade1, request);
    case "2":
      return indexerList(grade2, request);
    case "3":
      return indexerList(grade3, request);
    case "4":
      return indexerList(grade4, request);
    case "5":
      return indexerList(grade5, request);
    case "6":
      return indexerList(grade6, request);
    case "7":
      return indexerList(grade7, request);
    case "8":
      return indexerList(grade8, request);
    case "9":
      return indexerList(grade9, request);
    case "10":
      return indexerList(grade10, request);
    case "11":
      return indexerList(grade11, request);
    case "12":
      return indexerList(grade12, request);
    case "13":
      return indexerList(sat, request);
    case "14":
      return indexerList(toefl, request);
    case "15":
      return indexerList(ielt, request);
    case "16":
      return sceneList();
    case "17":
      return imageList(kitchen);
    case "18":
      return imageList(fruits);
    case "19":
      return imageList(animals);
    case "20":
      return imageList(food);
    case "21":
      return indexerList(oxford3000, request);
    case "emoji-1":
      return emojiList(emoji_activity);
    case "emoji-2":
      return emojiList(emoji_animal);
    case "emoji-3":
      return emojiList(emoji_food);
    case "emoji-4":
      return emojiList(emoji_object);
    case "emoji-5":
      return emojiList(emoji_travel);
  }

  const wordlist = [];
  for (var i = 0; i < 10; i++) {
    var randomIndex = Math.floor(Math.random() * indexer.length);
    var vec = list[indexer[randomIndex]];
    wordlist.push({ word: vec[0], definition: vec[1] });
  }

  return Response.json({ wordlist });
}


async function indexerList(indexer: number[], request: Request) {

  const indexes = [];
  for (var i = 0; i < 10; i++) {
    var randomIndex = Math.floor(Math.random() * indexer.length);
    indexes.push(indexer[randomIndex]);
  }

  const cookie = request.headers.get("cookie");
  const headers: HeadersInit = cookie ? { 'cookie': cookie } : {};
  const response = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/hts/api/v1/dict/index?indexes=" + indexes.join(","), {
    method: 'GET',
    headers
  })
  if (response.ok) {
    const data = await response.json();
    return Response.json({ wordlist: data.wordlist });
  }

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

