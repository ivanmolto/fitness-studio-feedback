import { NextRequest, NextResponse } from "next/server";
import { getAllFeedback } from "@/lib/data";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const courseSlug = searchParams.get("courseSlug");

    let feedback = await getAllFeedback();

    if (courseSlug) {
        feedback = feedback.filter((item) => item.courseSlug === courseSlug);
    }

    if (feedback.length === 0) {
        return NextResponse.json({
            totalEntries: 0,
            averageRating: 0,
            ratingDistribution: {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
            },
            courses: [],
        });
    }

    const totalEntries = feedback.length;
    let totalRatingSum = 0;

    const ratingDistribution: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
    };

    const courseStats = new Map<
        string,
        { totalEntries: number; totalRating: number }
    >();

    for (const item of feedback) {
        totalRatingSum += item.rating;

        if (item.rating >= 1 && item.rating <= 5) {
            ratingDistribution[item.rating]++;
        }

        const currentCourse = courseStats.get(item.courseSlug) || {
            totalEntries: 0,
            totalRating: 0,
        };
        currentCourse.totalEntries += 1;
        currentCourse.totalRating += item.rating;
        courseStats.set(item.courseSlug, currentCourse);
    }

    const averageRating = Math.round((totalRatingSum / totalEntries) * 10) / 10;

    const courses = Array.from(courseStats.entries()).map(([slug, stats]) => ({
        courseSlug: slug,
        totalEntries: stats.totalEntries,
        averageRating:
            stats.totalEntries > 0
                ? Math.round((stats.totalRating / stats.totalEntries) * 10) / 10
                : 0,
    }));

    return NextResponse.json({
        totalEntries,
        averageRating,
        ratingDistribution,
        courses,
    });
}