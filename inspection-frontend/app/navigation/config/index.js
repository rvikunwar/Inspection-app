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
import Notifications from '@screens/Notifications'
import { getNotificationCount, getUnseenMessages } from '@selectors' 


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
            tabBarIcon: ({ color }) =>  tabBarIconHaveNoty({countFunc: getUnseenMessages, color, name: "facebook-messenger" }),
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

    Notifications: {
        component:Notifications,
        options: {
            title: "Notifications",
            headerShown:false,
            tabBarIcon: ({ color }) =>  {                
                return tabBarIconHaveNoty({ countFunc: getNotificationCount, color, name: "facebook-messenger" })},
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
            tabBarIcon: ({ color }) =>  tabBarIconHaveNoty({countFunc: getUnseenMessages, color, name: "facebook-messenger" }),
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

    Notifications: {
        component:Notifications,
        options: {
            title: "Notifications",
            headerShown:false,
            tabBarIcon: ({ color }) =>  {              
                return tabBarIconHaveNoty({ countFunc: getNotificationCount, color, name: "bell" })},
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