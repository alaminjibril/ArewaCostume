import prisma from  "@/lib/prisma";



const authSeller = async (userId) => {
    try {
        
        //Find the user in the database and include their store relation
        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {store: true}
        })

        //Check if the user has a store and it’s approved
        if(user.store) {
            if(user.store.status === "approved") {
                //Return store ID if seller is approved
                return user.store.id
            }
        }else{
            return false
        }

    } catch (error) {
        console.error(error)
        return false
    }
}

export default authSeller