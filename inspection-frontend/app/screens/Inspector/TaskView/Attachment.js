import { CardFileAttachment, Icon, Text } from "@components";
import { useTheme, BaseColor } from "@config";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { formatBytes } from "@common";
import { HOST_URL } from '@env'
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';


const Attachment = ({ fileList}) => {

    async function schedulePushNotification(file) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Evidence file",
            body: `${file} is successfully downloaded`,
            data: { data: 'goes here' },
            categoryIdentifier:'download'
          },
          trigger: null ,
        });
      }

    const downloadFile = (uri, name) => {
        
        let fileUri = FileSystem.documentDirectory + name;
        FileSystem.downloadAsync(uri, fileUri)
        .then(({ uri }) => {
            saveFile(uri, name);
          })
          .catch(error => {
            console.error(error);
          })
    }
    
    const saveFile = async (fileUri, name) => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            const album = await MediaLibrary.getAlbumAsync('Download');
            if (album == null) {
                await MediaLibrary.createAlbumAsync('Download', asset, false);
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                schedulePushNotification(name)
              }
        }
    }

    const { colors } = useTheme();
    const { t } = useTranslation();

    const FileChecker = (item) => {
        let file;
        if(item === 'video'){
            file = { 
              icon: "file-video",
                  backgroundIcon: BaseColor.accentColor,
            }
        } else if(item === 'image'){
            file = {
                icon: "file-image",
                backgroundIcon: BaseColor.pinkLightColor,
              }
        }
        else if(item=== 'application'){
            file = {
                icon: "file-word",
                backgroundIcon: BaseColor.greenColor,
            }
        }
        else { file = {
            icon: "paperclip",
            backgroundIcon: BaseColor.pinkColor,
            }
        }
        return file
    }

    return (
        <Fragment>
            {fileList.map((item, index) => (
                <CardFileAttachment
                    style={{ paddingHorizontal: 0, justifyContent:"center" }}
                    key={index}
                    {...FileChecker(item.type)}
                    name={item?.file.name}
                    size={formatBytes(item.file.size)}
                    onPress={() => {

                        downloadFile(`${HOST_URL}${item.file.url}`, item?.file.name)
                   
                    }}
                />
            ))}
        </Fragment>
    );
};

export default Attachment;
