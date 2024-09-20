const DB_NAME = 'myLargeDatabase';
const DB_VERSION = 2;
const STORE_NAME = 'myDataStore';

let db;

const openDB = () => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            console.log(455555)
            db = event.target.result;
            // 检查对象存储是否已经存在，如果不存在则创建
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id1', autoIncrement: true });
                // db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                console.log("Object store created");
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database opened successfully");
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("Database error: ", event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
};

// 添加数据
const addData = async (data) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(data);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log("祝贺你,数据添加成功！");
                resolve();
            };
            request.onerror = () => {
                console.error("数据添加失败,别灰心,请检查id是否重复！");
                reject();
            };
        });
    } catch (error) {
        console.error("添加数据-未知错误:", error);
    }
};
// 替换指定 id 的数据 (传入id，取该id，有修改数据，无不做修改)
const updateDataById = async (data) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(data); // 使用 put 替换或插入数据

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`id为 ${data.id1} 的数据已成功更新`);
                resolve();
            };

            request.onerror = (event) => {
                console.error("更新数据时出错:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    } catch (error) {
        console.error("修改数据-未知错误:", error);
    }
};
// 获取单个id数据
const getData = async (id) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = () => {
                reject();
            };
        });
    } catch (error) {
        console.error("获取数据-未知错误:", error);
    }
};
// 获取所有 id 的方法
const getAllIds = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openCursor();

        const ids = [];

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    ids.push(cursor.key); // 获取当前记录的 id
                    cursor.continue(); // 继续遍历下一个记录
                } else {
                    resolve(ids); // 遍历完毕，返回所有 id
                }
            };

            request.onerror = () => {
                console.error("检索ID时出错！");
                reject();
            };
        });
    } catch (error) {
        console.error("获取所有 id-未知错误:", error);
    }
};
// 删除指定 id 的数据
const deleteDataById = async (id) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id); // 根据 id 删除数据

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`id为- ${id} 的数据已成功删除`);
                resolve();
            };

            request.onerror = (event) => {
                console.error("清除数单个据时出错:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    } catch (error) {
        console.error("清除 single 数据-未知错误:", error);
    }
};
// 删除所有数据
const clearAllData = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear(); // 清空对象存储

        return new Promise((resolve, reject) => {
            request.onsuccess = async () => {
                console.log("所有数据已成功清除！");
                // await openDB();
                resolve();
            };

            request.onerror = (event) => {
                console.error("清除数据时出错:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    } catch (error) {
        console.error("清除 all 数据-未知错误:", error);
    }
};

export default {
    openDB,
    addData,
    updateDataById,
    getData,
    getAllIds,
    deleteDataById,
    clearAllData
};
