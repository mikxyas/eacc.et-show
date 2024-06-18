import { getPosts } from "@/queries/get-posts";
import useSupabase from "./use-supabase";
import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";

function usePostsQuery({ client, page, sortByNew }: { client: SupabaseClient, page: number, sortByNew: boolean }) {

    const queryKey = ['posts', { page, sortByNew }];

    const queryFn = async () => {
        return getPosts(client, page, sortByNew).then(
            (result) => result
        );
    };

    return { queryKey, queryFn };
}

export default usePostsQuery;