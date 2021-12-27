import axios from 'axios';
import { HOST_URL } from "@env";
import { store } from 'app/store'



export const BASE_URL = HOST_URL


export const authAxios = axios.create({
    baseURL: BASE_URL,
});

export const UserAxios = axios.create({
    baseURL: BASE_URL,
});


const responseBody = (response) => response.data;


UserAxios.interceptors.request.use( (config) => {

    let access_token = store.getState().auth.login.token_access

    if (access_token) {
        config.headers.Authorization = `JWT ${access_token}`;
    }

    return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);




const requests = {
    get: (url) => UserAxios.get(url).then(responseBody),
    post: (url, body) => UserAxios.post(url, body).then(responseBody),
    put: (url, body) => UserAxios.put(url, body).then(responseBody),
    del: (url) => UserAxios.delete(url).then(responseBody),
};


// THis will contain all the endpoints of the resources
export const endPoints = {
    login: 'auth/jwt/create/',
    profileslist: 'accounts/usersprofilelist/',
    userDetails: 'accounts/profiledetails/',
    taskAssignedv1: 'inspectionapp/tasksassigned/',
    taskAssignedv2: (id) => `inspectionapp/tasksassigned/${id}/`,
    memberDetails: 'accounts/memberdetails/',
    todosv1: 'inspectionapp/todo/',
    todov2: (id) => `inspectionapp/todo/${id}/`,
    fileupload: 'inspectionapp/fileupload/',
    fileuploadv1: (id) => `inspectionapp/fileupload/${id}/`,
    entitylist: 'inspectionapp/entity/',
    areas: 'inspectionapp/areas/',
    entity: (id) => `inspectionapp/entity/${id}/`,
    todostats: 'inspectionapp/todostats/',
    inspectortasks: 'inspectionapp/inspectortasks/',
    managerstat: 'inspectionapp/managerstat/',
    inspectorstat: 'inspectionapp/inspectorstat/',
    areastat: 'inspectionapp/areastat/',
    managerprofile: 'accounts/managerprofile/',
    updatestatus:'inspectionapp/updatestatus/',
    updatetodostatus: 'inspectionapp/updatetodostatus/',
}


export const InspectionAPI = {

    //gives list of users
    listOfProfiles: ({ manager, area, entity}) => UserAxios.get(`${BASE_URL}/${endPoints.profileslist}`,{
        params:{ manager, area, entity }
    }).then(responseBody),

    //for current user id and other profile details
    getUserDetails: ( token ) => authAxios.get(`${BASE_URL}/${endPoints.userDetails}`, { headers: {
            "Authorization": `JWT ${token}`
        }}).then(responseBody),

    //gets list of tasks assigned
    getTasksAssigned: (role) => UserAxios.get(`${BASE_URL}/${endPoints.taskAssignedv1}`,{
            params:{role}
        }).then(responseBody),

    //get member profile details
    getMemberProfileDetails: (id) => UserAxios.get(`${BASE_URL}/${endPoints.memberDetails}`,{
            params:{id}
        }).then(responseBody),

    //post task 
    postTask: (body) => requests.post(`${BASE_URL}/${endPoints.taskAssignedv1}`, body),

    //update task data
    updateTaskData: (body, id) => requests.put(`${BASE_URL}/${endPoints.taskAssignedv2(id)}`, body),

    //get list of todos associated with task
    getListofTodos: (task) => UserAxios.get(`${BASE_URL}/${endPoints.todosv1}`,{
            params:{task}
        }).then(responseBody),

    //update todo data
    updateTodoData: (body, id) => requests.put(`${BASE_URL}/${endPoints.todov2(id)}`, body),

    //post todo data
    postTodoData: (body) => requests.post(`${BASE_URL}/${endPoints.todosv1}`, body),

    //delete todo data
    deleteTodoData: (id) => requests.del(`${BASE_URL}/${endPoints.todov2(id)}`),

    //file upload
    uploadFile: (form) => UserAxios.post(`${BASE_URL}/${endPoints.fileupload}`, form,{
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
    }).then(responseBody),

    //delete files
    deleteFile: (id) => requests.del(`${BASE_URL}/${endPoints.fileuploadv1(id)}`),

    //get files 
    getFilesforTask: (id) => UserAxios.get(`${BASE_URL}/${endPoints.fileupload}`,{
            params:{id}
        }).then(responseBody),

    //downlaod file
    downloadFile: (uri) => requests.get(`${BASE_URL}${uri}`),

    //get entity details
    getEntity: (id) => requests.get(`${BASE_URL}/${endPoints.entity(id)}`),

    //get depepartmen/entities list
    getEntityList: () => requests.get(`${BASE_URL}/${endPoints.entitylist}`),

    //get areas allocated to insopector
    getAreas: ({inspector, entity}) => UserAxios.get(`${BASE_URL}/${endPoints.areas}`,{
            params:{inspector, entity}
        }).then(responseBody),

    //Stats for todo's
    getTodosStats: (task) => UserAxios.get(`${BASE_URL}/${endPoints.todostats}`,{
            params:{task}
        }).then(responseBody),

    //tasks of inspector 
    getInspectorTasks: (role, user) => UserAxios.get(`${BASE_URL}/${endPoints.inspectortasks}`,{
            params:{role, user}
        }).then(responseBody),
    
    //delete task
    deleteTaskData: (id) => requests.del(`${BASE_URL}/${endPoints.taskAssignedv2(id)}`),

    //manager stats
    getManagerStat: (manager) => UserAxios.get(`${BASE_URL}/${endPoints.managerstat}`,{
            params:{manager}
        }).then(responseBody),

    //manager stats
    getInspectorStat: ({role,inspector,entity}) => UserAxios.get(`${BASE_URL}/${endPoints.inspectorstat}`,{
            params:{role,inspector,entity}
        }).then(responseBody),

    getAreaStat: (id, entity) => UserAxios.get(`${BASE_URL}/${endPoints.areastat}`,{
            params:{id, entity}
        }).then(responseBody),

    getManagerProfile: () =>  requests.get(`${BASE_URL}/${endPoints.managerprofile}`),

    //update status of task
    updateStatus: ({status, id}) => UserAxios.get(`${BASE_URL}/${endPoints.updatestatus}`,{
        params:{status,id}
    }).then(responseBody),

    //update todo status
    updateTodoStatus: ({status, id}) => UserAxios.get(`${BASE_URL}/${endPoints.updatetodostatus}`,{
        params:{status,id}
    }).then(responseBody),

}


//This will holds all the information about the users
export const userAgent = {
    loginUser: (data) =>
        authAxios.post(`${BASE_URL}/${endPoints.login}`, data).then(responseBody),
    };