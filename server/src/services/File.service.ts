import fs from "fs/promises";
import path from "path";

export async function deleteEmbedding(fileName: string) {
    try {
        const filePath = path.join(__dirname, 'embeddings', `${fileName}.json`);
        await fs.unlink(filePath);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Delete error:', error);
    }
}