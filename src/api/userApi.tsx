import Api from "../services/axios"
import { userEndPoints } from "../services/endpoints"

export const loginApi = async (data:any)=>{
  try {
    return await Api.post(userEndPoints.login,{email:data.email,password:data.password})
  } catch (error) {
    return Promise.reject(error)
  }
}


export const registerApi = async (data:any)=>{
  try {
    return await Api.post(userEndPoints.register,{name:data.name,email:data.email,password:data.password})
  } catch (error) {
    return Promise.reject(error)
  }
}

export const logout = async ()=>{
  try {
    return await Api.post(userEndPoints.logout)
  } catch (error) {
    return Promise.reject()
  }
}

export const createBlog = async (title:string,image:File,description:string,userId:string)=>{
  try {
    return await Api.post(userEndPoints.createBlog,{
      title,
      image,
      description,
      userId
    },{
      headers :{'Content-Type': 'multipart/form-data'}
    })
  } catch (error) {
    return Promise.reject()
  }
}

export const getAllBlogs = async ()=>{
  try {
    return await Api.get(userEndPoints.getAllBlogs)
  } catch (error) {
    return Promise.reject()
  }
}

export const getAllBlogsByUser = async (userId:string)=>{
  try {
    return await Api.get(`${userEndPoints.getAllBlogsByUser}/${userId}`)
  } catch (error) {
    return Promise.reject()
  }
}

export const deleteBlog = async (blogId:string)=>{
  try {
    return await Api.delete(`${userEndPoints.deleteBlog}/${blogId}`)
  } catch (error) {
    return Promise.reject()
  }
}

export const updateBlog = async (blogId:string,title:string,description:string,image:string)=>{
  try {
    return await Api.put(userEndPoints.updateBlog,{
      blogId,
      title,
      description,
      image
    },{
      headers :{'Content-Type': 'multipart/form-data'}
    })
  } catch (error) {
    return Promise.reject()
  }
}