

export async function get_zapped_comments({ client, user_id }: { client: any, user_id: string | null }) {
    // console.log(queryKey)
    try {
        const upvotedComments = await client
            .from('zaps')
            .select('comment_zapped')
            .eq('zapper', user_id)
            .not('comment_zapped', 'is', null)
        if (upvotedComments.error) {
            console.log(upvotedComments.error)
        } else {
            const ids: any = []
            // console.log(upvotedComments.data)
            const listOfIds = upvotedComments.data.map((id: any) => {
                ids.push(id.comment_zapped)
            })

            return ids
        }

    } catch (e) {
        console.log(e)
    }
}