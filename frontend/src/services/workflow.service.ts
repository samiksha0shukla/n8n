import {apiCaller} from "./api-caller"

export const getWorkflows = async () => {
    try {
        const res = await apiCaller.get("workf/workflow")

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("Workflow fetching error: ", error)
        return null
    }
}