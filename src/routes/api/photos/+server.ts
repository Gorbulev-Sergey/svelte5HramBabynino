import { db } from "$lib/scripts/firebase";
import { get, ref } from "firebase/database";

// Список альбомов
async function getAlbums() {
    let data = await get(ref(db, `/photos`));
    return await data.val();
}

// Альбом, т.е. список фотографий
async function getPhotos(uid: String) {
    let data = await get(ref(db, `/photos/${uid}`));
    return await data.val();
}

export async function GET({ request }) {
    let uid = new URLSearchParams(new URL(request.url).searchParams).get('uid');
    // Если uid не равет null, то запрашиваем альбом с uid, иначе запрашиваем все альбомы
    if (uid)
        return new Response(JSON.stringify(await getPhotos(uid)))
    else {
        return new Response(JSON.stringify(await getAlbums()))
    }
}