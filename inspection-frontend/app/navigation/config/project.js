import React from "react";
import { tabBarIcon,  tabBarIconHaveNoty, BottomTabNavigator } from "../components/index";
import Area from '@screens/Area'
import { ManagerTabScreens, InspectorTabScreens } from "./index";


const EntityTabScreens = {
    EntityView: {
        component:(data) => <EntityView data={data}/>,
        options: {
            title: "Departments",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "id-card-alt" }),
        },
    },

    Area: {
        component:(data) => <Area data={data}/>,
        options: {
            title: "Area",
            headerShown:false,
            tabBarIcon: ({ color }) => tabBarIcon({ color, name: "map" }),
        },
    },
}

const ProjectMenu = () => <BottomTabNavigator 
    tabScreens={ProjectTabScreens} 
    initialRoute="Entity"/>


const EntityMenu = ({route}) => {
    return <BottomTabNavigator 
        tabScreens={EntityTabScreens} 
        initialRoute="EntityView" 
        data={route}/>
    }



/**
 * @description screens for managers 
 */
 const ManagerHomeMenu = () => <BottomTabNavigator 
        tabScreens={ManagerTabScreens} 
        initialRoute="EntityView"/>

export const managerScreen = () => {

    return {
        ManagerHomeMenu: {
            component: ManagerHomeMenu,
            options: {
                title: "home"
            }
        },
    };
}



/**
 * @description screens for inspector 
 */
 const  InspectorHomeMenu = () => <BottomTabNavigator 
        tabScreens={InspectorTabScreens} 
        initialRoute="EntityView"/>

 export const inspectorScreen = () => {

    return {
        InspectorHomeMenu: {
            component: InspectorHomeMenu,
            options: {
                title: "home"
            }
        },
    };
}


export default {
    ProjectMenu: {
        component: ProjectMenu,
        options: {
            title: "home"
        }
    },

    EntityMenu: {
        component: EntityMenu,
        options: {
            title: "Entity"
        }
    },
};
