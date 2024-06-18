
import { SupabaseClient } from "@supabase/supabase-js";
import { get_zapped_posts } from "@/queries/get-zapped-posts";
import { get_zapped_comments } from "@/queries/get-zapped-commets";

function useCommentsZapped({ client, user_id, post_id }: { client: SupabaseClient, user_id: string | null, post_id: string }) {

    const queryKey = ['upvoted_comments', { id: post_id }];
    const queryFn = async () => {
        if (!user_id) return []
        return get_zapped_comments({ client, user_id }).then(
            (result) => result
        );
    };

    return { queryKey, queryFn };
}

export default useCommentsZapped;


