import TaskView from '@screens/Inspector/TaskView'
import AreaView from "@screens/Inspector/AreaView"
import InsProfileView from "@screens/Inspector/InsProfileView"
import TaskCreate from '@screens/Inspector/TaskCreate'
import EntityView from '@screens/Inspector/EntityView'
import AreaListView from '@screens/Inspector/AreasListView'

import TaskEdit from '@screens/Manager/TaskEdit'
import MInsProfileView from '@screens/Manager/InsProfileView'
import MTaskView from '@screens/Manager/TaskView'
import InsListView from '@screens/Manager/InsListView'
import Messages from "@screens/Messages"
import Camera from '@screens/Camera'
import PreviewMap from "@screens/PreviewMap"
import TodoCreate from "@screens/TodoCreate"
import ProfileEdit from "@screens/ProfileEdit"
import ChangePassword from '@screens/ChangePassword'
import Setting from '@screens/Settings'
import ThemeSetting from '@screens/Settings/ThemeSetting'
import FontOption from '@screens/Settings/FontOption'
import SelectDarkOption from '@screens/Settings/SelectDarkTheme'
import  Managers from '@screens/Inspector/Managers'

export const InspectorMainScreens = {

    EntityView:{
        component: EntityView,
        options: {
            title: "Entity view",
            headerShown:false,
        },   
    },

    Managers:{
        component: Managers,
        options: {
            title: "Managers",
            headerShown:false,
        },   
    },

    AreasListView:{
        component: AreaListView,
        options: {
            title: "Areas list view",
            headerShown:false,
        },   
    },

    CreateTask:{
        component: TaskCreate,
        options: {
            title: "Task create",
            headerShown:false,
        },   
    },
    
    TaskView: {
        component: TaskView,
        options: {
            title: "Task view",
            headerShown:false,
        },   
    },

    InsProfileView: {
        component: InsProfileView,
        options: {
            title: "Inspector profile",
            headerShown:false,
        },
    },
   
    AreaView: {
        component: AreaView,
        options: {
            title: "Area details",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },


    
}
    

export const MangerMainScreens = {

    TaskEdit: {
        component: TaskEdit,
        options: {
            title: "Edit task",
            headerShown:false,
        },   
    },

    InspectorProfile: {
        component: MInsProfileView,
        options: {
            title: "Inspector profile",
            headerShown:false,
        },   
    },

    TaskView: {
        component: MTaskView,
        options: {
            title: "Task view",
            headerShown:false,
        },   
    },

    InspectorListView: {
        component: InsListView,
        options: {
            title: "Inspectors list ",
            headerShown:false,
        },   
    },
}

export const CommonMainScreens = {
    PreviewMap: {
        component: PreviewMap,
        options: {
            title: "map",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    Setting: {
        component: Setting,
        options: {
            title: "Settings",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    FontOption: {
        component: FontOption,
        options: {
            title: "Font options",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    ThemeSetting: {
        component: ThemeSetting,
        options: {
            title: "Theme Settings",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    SelectDarkOption: {
        component: SelectDarkOption,
        options: {
            title: "Select Dark Option",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },
    },

    ChangePassword: {
        component: ChangePassword,
        options: {
            title: "Change password",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },
    },

    ProfileEdit: {
        component: ProfileEdit,
        options: {
            title: "Profile edit",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    Camera: {
        component: Camera,
        options: {
            title: "Camera",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "camera" }),
        }, 
    },

    Messages: {
        component: Messages,
        options: {
            title: "Messages",
            headerShown:false,
        },
    },

    
    TodoCreate: {
        component: TodoCreate,
        options: {
            title: "Todo create",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

}