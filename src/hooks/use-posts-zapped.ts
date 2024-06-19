
import useSupabase from "./use-supabase";
import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { get_zapped_posts } from "@/queries/get-zapped-posts";

function usePostsZapped({ client, user_id }: { client: SupabaseClient, user_id: string }) {

    const queryKey = ['posts_zapped'];

    const queryFn = async () => {


        return get_zapped_posts(client, user_id).then(
            (result) => result
        );


    };

    return { queryKey, queryFn };
}

export default usePostsZapped;


