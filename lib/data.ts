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

// TODO: Implement getFeedbackById
// Find a single entry by its id, or return undefined.
export async function getFeedbackById(
    id: string
): Promise<Feedback | undefined> {
    return undefined;
}

// TODO: Implement addFeedback
// Generate an id and createdAt, append the entry to the file, return it.
export async function addFeedback(
    entry: Omit<Feedback, "id" | "createdAt">
): Promise<Feedback> {
    throw new Error("Not implemented");
}