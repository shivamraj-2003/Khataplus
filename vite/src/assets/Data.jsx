import { openDB } from 'idb';

export const dbPromise = openDB('file-store', 1, {
    upgrade(db) {
        db.createObjectStore('files', { keyPath: 'name' });
    },
});

export const saveFile = async (file) => {
    const db = await dbPromise;
    const reader = new FileReader();
    reader.onloadend = async () => {
        await db.put('files', { name: file.name, data: reader.result });
    };
    reader.readAsArrayBuffer(file);
};

export const loadFiles = async () => {
    const db = await dbPromise;
    return db.getAll('files');
};
