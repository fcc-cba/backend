import * as admin from 'firebase-admin';

export const FILES_COLLECTION_NAME = 'files';

export interface File {
  fileId: string;
  filename: string;
}

export const createNewFile = async (options: { filename: string }) => {
  const fileRef = admin.firestore().collection(FILES_COLLECTION_NAME).doc();

  await fileRef.set({
    fileId: fileRef.id,
    filename: options.filename,
  });
}

export const getAllFiles = async (options: { offset: string, limit: string }): Promise<File[]> => {
  let query: FirebaseFirestore.Query = admin.firestore()
    .collection(FILES_COLLECTION_NAME);

  if (options.offset) {
    query = query.offset(Number(options.offset));
  }
  
  const limit = options.limit ? Number(options.limit) : 5;
  query = query.limit(limit);

  const snapshot = await query.get();
  return snapshot.docs.map(createFileFromDoc);
}

export const getFileById = async (fileId: string) => {
  const doc = await admin.firestore()
    .collection(FILES_COLLECTION_NAME)
    .doc(fileId);

  return createFileFromDoc(doc);
}

function createFileFromDoc(doc: FirebaseFirestore.DocumentData): File {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data() as File;

  return {
    filename: data.filename,
    fileId: data.fileId,
  }
}