import { getPost } from "@/queries/get-post";
import { SupabaseClient } from "@supabase/supabase-js";

function usePostQuery({ client, id }: { client: SupabaseClient, id: string}) {

    const queryKey = ['post', { id: id }];

    const queryFn = async () => {
        return getPost({ client, id }).then(
            (result) => result
        );
    };

        return { queryKey, queryFn };

}

export default usePostQuery;