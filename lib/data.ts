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
    const nextNumber = list.length + 1;
    const id = `fb-${String(nextNumber).padStart(3, "0")}`;
    const createdAt = new Date().toISOString();

    const newFeedback: Feedback = {
        id,
        ...entry,
        createdAt,
    };

    const updatedList = [...list, newFeedback];
    await fs.writeFile(DATA_PATH, JSON.stringify(updatedList, null, 4), "utf-8");

    return newFeedback;
}