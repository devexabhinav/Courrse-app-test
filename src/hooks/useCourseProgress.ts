// hooks/useCourseProgress.ts
import { useState, useCallback } from 'react';
import { useApiClient } from '@/lib/api';
import { getDecryptedItem } from '@/utils/storageHelper';
import type { Course, CourseProgressData, Chapter } from '@/types/course';

export const useCourseProgress = (courseId: string | null, setCourse: React.Dispatch<React.SetStateAction<Course | null>>) => {
    const api = useApiClient();
    const [courseProgress, setCourseProgress] = useState<CourseProgressData | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [submittingMCQ, setSubmittingMCQ] = useState(false);
    const [currentMCQChapter, setCurrentMCQChapter] = useState<Chapter | null>(null);

    const getUserId = useCallback(() => {
        const user = getDecryptedItem('userId');
        return user
    }, []);

    // hooks/useCourseProgress.ts - update handleLessonComplete
    const handleLessonComplete = useCallback(async (lessonId: number, chapterId: number) => {
        if (!courseId) {
            console.error('Course ID is required');
            return false;
        }

        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('Calling complete-lesson API:', { courseId, lessonId, chapterId, userId });

            const response = await api.post(`progress/${courseId}/complete-lesson`, {
                user_id: userId,
                lesson_id: lessonId,
                chapter_id: chapterId
            });

            console.log('Complete-lesson API response:', response);

            if (response.success) {
                // Update local state
                setCourse(prev => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        chapters: prev.chapters.map(chapter => {
                            if (chapter.id === chapterId) {
                                return {
                                    ...chapter,
                                    lessons: chapter.lessons.map(lesson =>
                                        lesson.id === lessonId
                                            ? { ...lesson, completed: true }
                                            : lesson
                                    )
                                };
                            }
                            return chapter;
                        })
                    };
                });

                // Update progress data
                if (response.data?.data?.progress) {
                    setCourseProgress(response.data.data.progress);
                }

                return true;
            } else {
                console.error('Failed to mark lesson as completed:', response.error);
                return false;
            }
        } catch (error) {
            console.error('[handleLessonComplete] Error:', error);
            return false;
        }
    }, [courseId, getUserId, api, setCourse, setCourseProgress]);


    // hooks/useCourseProgress.ts
    const submitMCQTest = useCallback(async () => {
        if (!currentMCQChapter || !courseId) {
            console.error('No MCQ chapter selected or course ID missing');
            return;
        }

        try {
            setSubmittingMCQ(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('Submitting MCQ:', {
                courseId,
                chapterId: currentMCQChapter.id,
                userAnswers
            });

            const response = await api.post(`progress/${courseId}/submit-mcq`, {
                user_id: userId,
                chapter_id: currentMCQChapter.id,
                answers: userAnswers
            });

            if (response.success) {
                console.log('MCQ submitted successfully:', response.data);

                // Update local state
                setCourse(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        chapters: prev.chapters.map(chapter =>
                            chapter.id === currentMCQChapter.id
                                ? { ...chapter, mcq_passed: true }
                                : chapter
                        )
                    };
                });

                // Update progress
                if (response.data?.data) {
                    setCourseProgress(response.data.data);
                }

                // Close modal and reset
                setCurrentMCQChapter(null);
                setUserAnswers({});

                // Show success message
                alert('MCQ submitted successfully!');
            } else {
                console.error('Failed to submit MCQ:', response.error);
                alert(response.error?.message || 'Failed to submit MCQ');
            }
        } catch (error) {
            console.error('[submitMCQTest] Error:', error);
            alert('Error submitting MCQ. Please try again.');
        } finally {
            setSubmittingMCQ(false);
        }
    }, [currentMCQChapter, courseId, userAnswers, getUserId, api, setCourse, setCourseProgress]);


    const handleStartMCQ = useCallback((chapter: Chapter) => {
        setCurrentMCQChapter(chapter);
        setUserAnswers({});
    }, []);

    const handleCloseMCQ = useCallback(() => {
        setCurrentMCQChapter(null);
        setUserAnswers({});
    }, []);

    const initializeProgress = useCallback((progress: CourseProgressData) => {
        setCourseProgress(progress);
    }, []);

    return {
        courseProgress,
        setCourseProgress,
        userAnswers,
        setUserAnswers,
        submittingMCQ,
        currentMCQChapter,
        handleLessonComplete,
        submitMCQTest,
        handleStartMCQ,
        handleCloseMCQ,
        initializeProgress,
        getUserId,
    };
};