import list from "../../data/dict.json";
import grade1 from "../../data/index/grade1Index.json";
import grade2 from "../../data/index/grade2Index.json";
import grade3 from "../../data/index/grade3Index.json";
import grade4 from "../../data/index/grade4Index.json";
import grade5 from "../../data/index/grade5Index.json";
import grade6 from "../../data/index/grade6Index.json";
import grade7 from "../../data/index/grade7Index.json";
import grade8 from "../../data/index/grade8Index.json";
import grade9 from "../../data/index/grade9Index.json";
import grade10 from "../../data/index/grade10Index.json";
import grade11 from "../../data/index/grade11Index.json";
import grade12 from "../../data/index/grade12Index.json";
import kindergarten from "../../data/index/kindergartenIndex.json";
import ielt from "../../data/index/IELTIndex.json";
import toefl from "../../data/index/TOEFLIndex.json";
import sat from "../../data/index/SATIndex.json";
import scene from "../../data/scene.json";
import kitchen from "../../data/imageset/kitchen.json";
import fruits from "../../data/imageset/fruits.json";
import animals from "../../data/imageset/animals.json";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const level = params.get("level");
  var indexer = ielt;
  switch (level) {
    case "0":
      indexer = kindergarten;
      break;
    case "1":
      indexer = grade1;
      break;
    case "2":
      indexer = grade2;
      break;
    case "3":
      indexer = grade3;
      break;
    case "4":
      indexer = grade4;
      break;
    case "5":
      indexer = grade5;
      break;
    case "6":
      indexer = grade6;
      break;
    case "7":
      indexer = grade7;
      break;
    case "8":
      indexer = grade8;
      break;
    case "9":
      indexer = grade9;
      break;
    case "10":
      indexer = grade10;
      break;
    case "11":
      indexer = grade11;
      break;
    case "12":
      indexer = grade12;
      break;
    case "13":
      indexer = sat;
      break;
    case "14":
      indexer = toefl;
      break;
    case "15":
      indexer = ielt;
      break;
    case "16":
      return sceneList();
    case "17":
      return imageList(kitchen);
    case "18":
      return imageList(fruits);
    case "19":
      return imageList(animals);
  }

  const wordlist = [];
  for (var i = 0; i < 10; i++) {
    var randomIndex = Math.floor(Math.random() * indexer.length);
    var vec = list[indexer[randomIndex]];
    wordlist.push({ word: vec[0], definition: vec[1] });
  }

  return Response.json({ wordlist });
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
