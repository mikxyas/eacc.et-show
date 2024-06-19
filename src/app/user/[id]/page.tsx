import ViewProfileComp from "@/components/ViewProfileComp";

export default function User(context: any) {
    return <ViewProfileComp id={context.params.id} />
}
