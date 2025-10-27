// hooks/useWishlist.ts
import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from "@/lib/api";
import { getDecryptedItem } from "@/utils/storageHelper";

export interface WishlistItem {
    id: number;
    user_id: number;
    course_id: number;
    createdAt: string;
    updatedAt: string;
    course: {
        id: number;
        title: string;
        description: string;
        category: string;
        image: string;
        creator: string;
        price: string;
        price_type: string;
        duration: string;
        ratings: number;
        enrollment_count: number;
        is_active: boolean;
        status: string;
        has_chapters: boolean;
        totalChapters?: number;
        totalLessons?: number;
        totalMCQs?: number;
    };
}

export const useWishlist = () => {
    const api = useApiClient();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUserId = (): string | null => {
        const UserId = getDecryptedItem("userId");
        return UserId ? String(UserId) : null;
    };

    // Add course to wishlist
    const addToWishlist = useCallback(async (course: any) => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await api.post('wishlist/add', {
                user_id: userId,
                course_id: course.id
            });

            if (response.success) {
                // Refresh wishlist
                await fetchWishlist();
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error?.message || "Failed to add to wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to add to wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Remove course from wishlist
    const removeFromWishlist = useCallback(async (courseId: number) => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await api.post('wishlist/remove', {
                user_id: userId,
                course_id: courseId
            });

            if (response.success) {
                // Refresh wishlist
                await fetchWishlist();
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error?.message || "Failed to remove from wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to remove from wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Toggle wishlist status
    const toggleWishlist = useCallback(async (course: any, isCurrentlyInWishlist: boolean) => {
        if (isCurrentlyInWishlist) {
            return await removeFromWishlist(course.id);
        } else {
            return await addToWishlist(course);
        }
    }, [addToWishlist, removeFromWishlist]);

    // Check if course is in wishlist (client-side)
    const isInWishlist = useCallback((courseId: number): boolean => {
        return wishlist.some(item => item.course.id === courseId);
    }, [wishlist]);

    // Check wishlist status from server
    const checkWishlistStatus = useCallback(async (courseId: number) => {
        try {
            const userId = getUserId();

            if (!userId) {
                return false;
            }

            const url = `wishlist/check?user_id=${userId}&course_id=${courseId}`;
            const response = await api.get(url);

            if (response.success) {
                return response.data.data.in_wishlist;
            }
            return false;
        } catch (err) {
            console.error("Error checking wishlist status:", err);
            return false;
        }
    }, [api]);

    // Fetch user's wishlist
    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                setWishlist([]);
                return;
            }

            const response = await api.get(`wishlist/user/${userId}`);

            if (response.success) {
                setWishlist(response.data.data.wishlist || []);
                setError(null);
            } else {
                throw new Error(response.error?.message || "Failed to fetch wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch wishlist";
            setError(errorMessage);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Get wishlist count
    const getWishlistCount = useCallback(async () => {
        try {
            const userId = getUserId();

            if (!userId) {
                return 0;
            }

            const response = await api.get(`wishlist/count/${userId}`);

            if (response.success) {
                return response.data.data.wishlist_count;
            }
            return 0;
        } catch (err) {
            console.error("Error getting wishlist count:", err);
            return 0;
        }
    }, [api]);

    // Clear error
    const clearError = useCallback(() => setError(null), []);

    // Auto-fetch wishlist on component mount
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    return {
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        checkWishlistStatus,
        fetchWishlist,
        getWishlistCount,
        clearError
    };
};