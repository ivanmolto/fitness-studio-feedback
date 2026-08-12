import fs from "fs/promises";
import path from "path";
import type { Feedback } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "feedback.json");

export async function getAllFeedback(): Promise<Feedback[]> {
    try {
        const fileData = await fs.readFile(DATA_PATH, "utf-8");
        return JSON.parse(fileData) as Feedback[];
    } catch (error) {
        console.error("Error reading feedback data:", error);
        return [];
    }
}

export async function getFeedbackById(
    id: string
): Promise<Feedback | undefined> {
    const feedbackList = await getAllFeedback();
    return feedbackList.find((item) => item.id === id);
}

export async function addFeedback(
    entry: Omit<Feedback, "id" | "createdAt">
): Promise<Feedback> {
    const list = await getAllFeedback();
    const newEntry: Feedback = {
        ...entry,
        id: `fb-${String(list.length + 1).padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
    };
    list.push(newEntry);
    await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), "utf-8");
    return newEntry;
}