import { Icon, Text } from "@components";
import { useTheme, BaseColor } from "@config";
import { PAttachments } from "@data";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";
import { formatBytes } from "@common";
import { FileAttachment } from '@container'
import { InspectionAPI } from "../../../connect/api";


const ChooseFile = ({ fileList, setFileList }) => {

    const FileChecker = (item) => {
        let file;
        if(item=== 'video'){
            file = { 
              icon: "file-video",
              backgroundIcon: BaseColor.accentColor,
            }
        } else if(item=== 'image'){
            file = {
                icon: "file-image",
                backgroundIcon: BaseColor.pinkLightColor,
              }
        }
        else if(item === 'application'){
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

    const DocumentPickerfunc = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
   
        fileList.push({file:result})
        setFileList([
            ...fileList
        ])
    }

    const deleteFile = (item, indexv1) => {

        if(item.id){
            InspectionAPI.deleteFile(item.id)
        }
        setFileList(()=>{
            let data = fileList.filter((item,index)=>{
            if(index!=indexv1){
                return item
                }
            })
        return data
    })
        
    }

    const { colors } = useTheme();
    const { t } = useTranslation();


    return (
        <Fragment>

            {fileList.map((item, index) => (
                <FileAttachment
                    style={{ paddingHorizontal: 0, justifyContent:"center" }}
                    key={index}
                    {...FileChecker(item.mimeType)}
                    percent={item.percent}
                    size={formatBytes(item.file.size)}
                    name={item?.file?.name}
                    onPress={() => {
                        deleteFile(item,index)
                    }}
                />
            ))}

              <TouchableOpacity onPress={DocumentPickerfunc}
                style={{
                    backgroundColor: colors.card,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 10,
                }}
                >
                <Icon
                    name="cloud-upload-alt"
                    size={48}
                    color={colors.primaryLight}
                />
                <Text headline>{t("upload_your_files")}</Text>
                <Text footnote light>
                    {t("description_upload_file")}
                </Text>
            </TouchableOpacity>
        </Fragment>
    );
};

export default ChooseFile;
