// types/course.ts
export interface Lesson {
    id: number;
    title: string;
    content: string;
    video_url: string;
    duration: number;
    order: number;
    is_preview: boolean;
    type: "lesson";
    completed?: boolean;
}

export interface MCQ {
    id: number;
    question: string;
    options: string[];
    type: "mcq";
    correct_answer?: number;
}

export interface ChapterProgress {
    locked: boolean;
    completed: boolean;
    mcq_passed: boolean;
    lesson_completed: boolean;
    lessons: {
        completed: number;
        total: number;
        all_completed: boolean;
    };
    can_attempt_mcq: boolean;
}

export interface Chapter {
    id: number;
    title: string;
    order: number;
    duration: number;
    user_progress: any;
    lessons: Lesson[];
    mcqs: MCQ[];
    progress?: ChapterProgress;
    locked?: boolean;
    completed?: boolean;
}

export interface Course {
    id: number;
    title: string;
    subtitle: string | null;
    description: string;
    category: string;
    image: string;
    creator: string;
    price: string;
    price_type: string;
    duration: string;
    status: string;
    features: any[];
    is_active: boolean;
    ratings: number;
    enrollment_count: number;
    createdAt: string;
    updatedAt: string;
    statistics: {
        total_chapters: number;
        total_lessons: number;
        total_mcqs: number;
        total_duration: number;
        has_content: boolean;
        total_enrolled: number;
    };
    user_data: any;
    chapters: Chapter[];
}

export interface CourseProgressData {
    course_id: number;
    user_id: number;
    overall_progress: number;
    total_chapters: number;
    completed_chapters: number;
    chapters: Chapter[];
}