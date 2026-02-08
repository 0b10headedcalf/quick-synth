import { useState, useEffect } from 'react';
import { databases, client, DB_ID, ROOMS_COLLECTION } from '@/lib/appwrite';
import { Models } from 'appwrite';

/**
 * useRoom Hook
 * Manages the state of a single music room and synchronizes changes in realtime.
 */
export function useRoom(roomId: string) {
    const [roomData, setRoomData] = useState<Models.Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId) return;

        // 1. Fetch the initial room data from the database
        const fetchRoom = async () => {
            try {
                const data = await databases.getDocument(DB_ID, ROOMS_COLLECTION, roomId);
                setRoomData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();

        // 2. Subscribe to REALTIME changes for this specific room
        // Whenever the document is updated in Appwrite (by anyone), 
        // this callback will trigger and update our local state.
        const unsubscribe = client.subscribe(
            `databases.${DB_ID}.collections.${ROOMS_COLLECTION}.documents.${roomId}`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                    setRoomData(response.payload as Models.Document);
                }
            }
        );

        // Cleanup the subscription when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [roomId]);

    /**
     * updateRoom
     * Updates the room data in Appwrite. Because we are subscribed to realtime updates,
     * we don't need to manually update local state; the subscription will do it for us!
     */
    const updateRoom = async (newData: any) => {
        try {
            await databases.updateDocument(DB_ID, ROOMS_COLLECTION, roomId, newData);
        } catch (err: any) {
            console.error('Failed to update room:', err);
        }
    };

    return { roomData, loading, error, updateRoom };
}
