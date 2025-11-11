import { v4 as uuidv4 } from "uuid";
export const getS3TaskFileUrl = ({
  clientId,
  dbName,
  fileName,
  taskId,
  type,
}: ITaskFileParams) => {
  return `customers/tasks/${dbName}/client/${clientId}/${taskId}/${type}/${new Date().getTime()}/${fileName}`;
};

export const getS3ClientProfilePictureUrl = ({
  clientId,
  dbName,
  fileName,
}: IClientDPParams) => {
  return `customers/profile_pictures/${dbName}/client/${clientId}/${new Date().getTime()}/${fileName}`;
};

export const getParamsFromS3ClientProfilePictureUrl = (url: string) => {
  const [_cu, dbName, _c, clientId, _p, _t, fileName] = url.split("/");

  return { dbName, clientId, fileName };
};

export const getParamsFromS3TaskFileUrl = (url: string) => {
  const [_cu, dbName, _c, clientId, _t, taskId, type, _ti, fileName] =
    url.split("/");

  return { dbName, clientId, taskId, type, fileName };
};

interface ITaskFileParams {
  taskId: string;
  clientId: string;
  /**
   * using dbName only for unique customer folder structuring
   */
  dbName: string;
  type: "attachment" | "refusal_document";
  fileName: string;
}

interface IClientDPParams {
  clientId: string;
  /**
   * using dbName only for unique customer folder structuring
   */
  dbName: string;
  fileName: string;
}

// s3/{db_name}/client/{client_id}/task/{task_id}/attachments/{timestamp}/filename

export const getS3AttachmentTempUrl = ({
  dbName,
  fileName,
}: IAttachmentTempUrlParams) => {
  return `customers/temp/attachments/${dbName}/${uuidv4()}/${new Date().getTime()}/${fileName}`;
};

interface IAttachmentTempUrlParams {
  /**
   * using dbName only for unique customer folder structuring
   */
  dbName: string;
  fileName: string;
}
