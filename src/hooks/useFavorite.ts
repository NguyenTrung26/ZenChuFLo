import { useState, useEffect, useCallback } from "react";
import { auth } from "../services/firebase/config";
import {
    isWorkoutFavorited,
    addFavorite,
    removeFavorite,
    addWorkoutIfNotExists,
} from "../services/firebase/firestore";
import type { Workout } from "../types";

export const useFavorite = (workout: Workout) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    const checkStatus = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const status = await isWorkoutFavorited(user.uid, workout.id);
            setIsFavorited(status);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setLoading(false);
        }
    }, [user, workout.id]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const toggleFavorite = async () => {
        if (!user || loading) return;
        setLoading(true);

        try {
            if (isFavorited) {
                await removeFavorite(user.uid, workout.id);
                setIsFavorited(false);
            } else {
                await addWorkoutIfNotExists(workout);
                await addFavorite(user.uid, workout.id);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Revert state if needed or show error
        } finally {
            setLoading(false);
        }
    };

    return { isFavorited, loading, toggleFavorite };
};
