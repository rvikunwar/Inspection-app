import { 
    tabBarIcon,  
    tabBarIconHaveNoty, 
} from "../components/index";
import Messenger from "@screens/Messenger";
import Profile from "@screens/Profile";
import Task from "@screens/Manager/Task";
import InsTask from "@screens/Inspector/Task";
import EntityView from '@screens/Manager/EntityView'
import Entity from "@screens/Inspector/Entity";


/**
 * @description manager views
 */
export const ManagerTabScreens = {

    Entity: {
        component:EntityView,
        options: {
            title: "Department",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "briefcase" }),
        },
        
    },
        
    Messenger: {
        component:Messenger,
        options: {
            title: "Messenger",
            headerShown:false,
            tabBarIcon: ({ color }) =>  tabBarIconHaveNoty({ color, name: "facebook-messenger" }),
        },
    },


    Tasks: {
        component:Task,
        options: {
            title: "Tasks",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    Profile: {
        component:Profile,
        options: {
            title: "Profile",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "user-ninja" }),
        },
    },
};


/**
 * @description inspector view
 */
export const InspectorTabScreens = {

    Entity: {
        component:Entity,
        options: {
            title: "Entity",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "briefcase" }),
        }, 
    },

    Messenger: {
        component:Messenger,
        options: {
            title: "Messenger",
            headerShown:false,
            tabBarIcon: ({ color }) =>  tabBarIconHaveNoty({ color, name: "facebook-messenger" }),
        },
    },
    
    Tasks: {
        component:InsTask,
        options: {
            title: "Tasks",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "tasks" }),
        },   
    },

    Profile: {
        component:Profile,
        options: {
            title: "Profile",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "user-ninja" }),
        },
    },
}