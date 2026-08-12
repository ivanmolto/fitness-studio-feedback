import { NextRequest, NextResponse } from "next/server";

// TODO: Import data utilities from @/lib/data
import {
    getAllFeedback,
    addFeedback
} from "@/lib/data";

export async function GET(request: NextRequest) {
    const feedback = await getAllFeedback();
    return NextResponse.json(feedback);
}

export async function POST(request: NextRequest) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload in request body" },
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object") {
        return NextResponse.json(
            { error: "Request body must be a JSON object" },
            { status: 400 }
        );
    }

    const { courseSlug, lessonSlug, rating, comment, author } = body;

    const missingFields: string[] = [];
    if (typeof courseSlug !== "string" || !courseSlug.trim()) missingFields.push("courseSlug");
    if (typeof lessonSlug !== "string" || !lessonSlug.trim()) missingFields.push("lessonSlug");
    if (rating === undefined || rating === null) missingFields.push("rating");
    if (typeof comment !== "string" || !comment.trim()) missingFields.push("comment");
    if (typeof author !== "string" || !author.trim()) missingFields.push("author");

    if (missingFields.length > 0) {
        return NextResponse.json(
            { error: `Missing or empty required field(s): ${missingFields.join(", ")}` },
            { status: 400 }
        );
    }

    if (typeof rating !== "number" || isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
            { error: "Rating must be a number between 1 and 5" },
            { status: 400 }
        );
    }

    const newFeedback = await addFeedback({
        courseSlug: courseSlug.trim(),
        lessonSlug: lessonSlug.trim(),
        rating,
        comment: comment.trim(),
        author: author.trim(),
    });

    return NextResponse.json(newFeedback, { status: 201 });
}