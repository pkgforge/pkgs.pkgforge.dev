let database: IDBDatabase;

export function getDB() {
  return new Promise((ret, rej) => {
    const db = window.indexedDB.open("pkgs", 1);

    // eslint-disable-next-line
    const handler = (_: unknown) => {
      database = db.result;
      ret(undefined);
    };

    db.onsuccess = handler;
    db.onupgradeneeded = (e) => {
      const d = db.result;

      d.createObjectStore("pkgs");

      handler(e);
    };

    // eslint-disable-next-line
    const e = (_: unknown) => rej(undefined);
    db.onerror = e;
    db.onblocked = e;
  });
}

export function setJSONInDB(json: string) {
  if (!database) {
    return undefined;
  }

  const pkgs = database.transaction("pkgs", "readwrite").objectStore("pkgs");

  pkgs.clear();
  pkgs.add(json, 0);

  // Expire in 10 minutes
  pkgs.add(Date.now() + (10 * 60 * 1000), 1);
}

function asyncify<T>(get: IDBRequest<T>): Promise<T | undefined> {
  return new Promise((ret, rej) => {
    get.onsuccess = () => ret(get.result);
    get.onerror = rej;
  });
}

export async function getJSONFromDB(): Promise<string | undefined> {
  if (!database) {
    return undefined;
  }

  const pkgs = database.transaction("pkgs", "readonly").objectStore("pkgs");

  const data = await asyncify<string>(pkgs.get(0));
  const expires = await asyncify<number>(pkgs.get(1));

  if (expires && expires < Date.now()) {
    return undefined;
  }

  return data;
}