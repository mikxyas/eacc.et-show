import EditPostForm from "@/components/EditPostForm";


export default function EditPost(context: any) {

    return <EditPostForm id={context.params.id} />


}
